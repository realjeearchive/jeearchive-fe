import { decryptData } from "@/lib/decrypt";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/features/auth/api"; 
import { 
  PaperApiResponse,
  TestDefinition, 
  TestSection, 
  TestQuestion,
  BackendQuestion, 
  TestOption 
} from "./types";

// Ensure this matches your auth configuration.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// --- Helper Functions ---

async function handleJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      'Something went wrong. Please try again.';
    throw new ApiError(message, res.status);
  }

  if (data && data.data !== undefined) {
    return { ...data, ...data.data } as T;
  }

  return data as T;
}

// --- API Requests ---

// 1. Fetch List of Papers (for Dashboard)
export async function fetchPapersByYear(params: { year: string; accessToken: string }) {
  const res = await fetch(
    `${API_BASE_URL}/paper/get?year=${params.year}&examName=JEE_MAIN`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.accessToken}`,
      },
    }
  );

  return handleJson<PaperApiResponse>(res);
}

// 2. Fetch & Decrypt Single Test Content (for Attempt Page)
export async function fetchTestContent(paperId: string): Promise<TestDefinition | null> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error("Unauthorized");

  const res = await fetch(`${API_BASE_URL}/question/paperQuestions/${paperId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new ApiError("Failed to fetch questions", res.status);

  const json = await res.json() as { data: string };
  const encryptedPayload = json.data;

  // Decrypt
  const decryptedData = decryptData<unknown>(encryptedPayload);

  if (!decryptedData) {
    throw new Error("Decryption failed (result is null)");
  }

  // --- Robust Data Extraction ---
  let questionsArray: BackendQuestion[] = [];

  if (Array.isArray(decryptedData)) {
    questionsArray = decryptedData as BackendQuestion[];
  } 
  else if (
    typeof decryptedData === 'object' && 
    decryptedData !== null &&
    'data' in decryptedData &&
    Array.isArray((decryptedData as { data: unknown }).data)
  ) {
    questionsArray = (decryptedData as { data: BackendQuestion[] }).data;
  }
  else if (
    typeof decryptedData === 'object' && 
    decryptedData !== null &&
    'questions' in decryptedData &&
    Array.isArray((decryptedData as { questions: unknown }).questions)
  ) {
    questionsArray = (decryptedData as { questions: BackendQuestion[] }).questions;
  } 
  else {
    console.error("Unexpected Data Structure:", decryptedData);
    throw new Error("Decrypted data is not a valid list of questions");
  }

  return mapBackendDataToDefinition(paperId, questionsArray);
}

// --- NEW MAPPER HELPER (Splits Subjects into SC & Numerical) ---

function mapBackendDataToDefinition(paperId: string, questions: BackendQuestion[]): TestDefinition {
  
  // 1. Identify all subjects (e.g. Physics, Chemistry, Maths)
  // We use a Set to keep them unique and preserve order
  const subjects = new Set<string>();
  questions.forEach(q => {
    if (q.subject) subjects.add(q.subject);
  });

  let globalCounter = 0; 
  const sections: TestSection[] = [];

  // 2. Loop through each subject and create TWO sections
  Array.from(subjects).forEach((subject) => {
    
    // Get all questions for this subject
    const subjectQuestions = questions.filter(q => q.subject === subject);

    // Filter A: Single Correct (MCQs)
    // Note: Checking strictly against 'Integer' or 'Numerical' to separate them
    const mcqQuestions = subjectQuestions.filter(q => 
      q.type !== 'Integer' && q.type !== 'Numerical'
    );
    
    // Filter B: Numerical (Integer Type)
    const numQuestions = subjectQuestions.filter(q => 
      q.type === 'Integer' || q.type === 'Numerical'
    );

    // --- Create Section 1: Single Correct ---
    if (mcqQuestions.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} (Section A)`, // Or `${subject} Single Correct`
        subject: subject,
        questions: mcqQuestions.map((q, idx) => 
          mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1)
        )
      });
    }

    // --- Create Section 2: Numerical ---
    if (numQuestions.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} (Section B)`, // Or `${subject} Numerical`
        subject: subject,
        questions: numQuestions.map((q, idx) => 
          mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1)
        )
      });
    }
  });

  return {
    id: paperId,
    title: "JEE Main Mock Test",
    durationSeconds: 180 * 60, 
    sections: sections,
  };
}

// --- Question Mapper Helper ---

function mapSingleQuestion(
  q: BackendQuestion, 
  globalIndex: number, 
  sectionId: string, 
  localIndex: number
): TestQuestion {
  
  const isInteger = q.type === 'Integer' || q.type === 'Numerical';
  
  // Ensure images is always an array
  const imgArray = Array.isArray(q.image) ? q.image : (q.image ? [q.image] : []);

  // Map Options (A, B, C, D)
  const optionsList: TestOption[] = [];
  if (!isInteger && q.options) {
    const labels = ['A', 'B', 'C', 'D'];
    labels.forEach((lbl) => {
      // Cast properties to safe types
      const textKey = `option${lbl}text` as keyof typeof q.options;
      const imgKey = `option${lbl}image` as keyof typeof q.options;
      
      const optText = q.options[textKey] as string;
      const optImgs = q.options[imgKey] as string[];
      
      optionsList.push({
        id: lbl,
        label: lbl,
        text: optText || '',
        imageUrl: (optImgs && optImgs.length > 0) ? optImgs[0] : null
      });
    });
  }

  return {
    id: q.id,
    index: localIndex, // 1, 2, 3... specific to this section
    globalQuestionNumber: globalIndex, // 1...75 across entire paper
    kind: isInteger ? 'numerical' : 'single',
    
    contentText: q.content || "",
    
    // Pass the full array for placeholders like ![image_0](0)
    images: imgArray, 
    contentImageUrl: imgArray.length > 0 ? imgArray[0] : null,
    
    options: optionsList,
    correctMarks: q.positiveMarks || 4,
    negativeMarks: q.negativeMarks || (isInteger ? 0 : -1), 
    sectionId: sectionId
  };
}