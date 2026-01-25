// src/features/tests/api.ts
import { decryptData } from "@/lib/decrypt";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/features/auth/api"; 
import { 
  PaperApiResponse,
  TestDefinition, 
  TestSection, 
  TestQuestion,
  BackendQuestion, 
  TestOption,
  LastTestStatusResponse,
  CreateTestResponse,
  SessionDataResponse,
  UpdateTestStatusPayload,
  BackendOptionsObject
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// --- Helper Functions ---

function getToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    
    if (data && typeof data === 'object' && 'message' in data) {
      message = (data as { message: string }).message;
    } else if (data && typeof data === 'object' && 'error' in data) {
      message = (data as { error: string }).error;
    }
    
    throw new ApiError(message, res.status);
  }

  // Unwrap { data: ... } structure if present
  if (data && typeof data === 'object' && 'data' in data && (data as { data: unknown }).data !== undefined) {
    return { ...data, ...(data as { data: object }).data } as T;
  }

  return data as T;
}

// ==========================================
// 1. PAPER LIST & CONTENT
// ==========================================

export async function fetchPapersByYear(params: { 
  year: string; 
  accessToken: string;
  examName?: 'JEE_MAIN' | 'JEE_ADVANCED'; 
}) {
  const exam = params.examName || 'JEE_MAIN';
  const res = await fetch(
    `${API_BASE_URL}/paper/get?year=${params.year}&examName=${exam}`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.accessToken}`,
      },
      credentials: 'include',
    }
  );
  return handleJson<PaperApiResponse>(res);
}

export async function fetchTestContent(paperId: string): Promise<TestDefinition | null> {
  const accessToken = getToken();
  if (!accessToken) throw new Error("Unauthorized: No access token found.");

  const res = await fetch(`${API_BASE_URL}/question/paperQuestions/${paperId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  if (!res.ok) throw new ApiError("Failed to fetch questions", res.status);

  const json = await res.json() as { data: string };
  const encryptedPayload = json.data;
  const decryptedData = decryptData<unknown>(encryptedPayload);

  if (!decryptedData) throw new Error("Decryption failed");

  let questionsArray: BackendQuestion[] = [];
  
  if (Array.isArray(decryptedData)) {
    questionsArray = decryptedData as BackendQuestion[];
  } else if (typeof decryptedData === 'object' && decryptedData !== null && 'data' in decryptedData) {
    const dataObj = decryptedData as { data: unknown };
    if (Array.isArray(dataObj.data)) {
      questionsArray = dataObj.data as BackendQuestion[];
    }
  }

  return mapBackendDataToDefinition(paperId, questionsArray);
}

// ==========================================
// 2. SESSION MANAGEMENT
// ==========================================

export async function fetchLastTestStatus(paperId: string) {
  const res = await fetch(`${API_BASE_URL}/testStatus/lastTestDetails?paperId=${paperId}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  });
  // We handle the JSON manually to allow 404s/empty states if needed, 
  // but using handleJson keeps error handling consistent.
  return handleJson<LastTestStatusResponse>(res);
}

export async function createTestSession(paperId: string) {
  const token = getToken();
  
  if (!token) {
    console.error("Create Session Failed: No Access Token found.");
    throw new Error("Authentication missing. Please log in again.");
  }

  if (!paperId) {
    throw new Error("Invalid Test ID.");
  }

  const payload = { paperId };

  const res = await fetch(`${API_BASE_URL}/testStatus/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  
  return handleJson<CreateTestResponse>(res);
}

export async function fetchTestSession(testStatusId: string) {
  const res = await fetch(`${API_BASE_URL}/testStatus/getPaper?testStatusId=${testStatusId}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  });
  
  // Unwrap the specific data structure for session loading
  return handleJson<{ success: boolean; message: string; data: SessionDataResponse }>(res);
}

export async function updateTestSession(payload: UpdateTestStatusPayload) {
  const res = await fetch(`${API_BASE_URL}/testStatus/update`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleJson<{ success: boolean; message: string }>(res);
}

// --- MAPPERS ---

function mapBackendDataToDefinition(paperId: string, questions: BackendQuestion[]): TestDefinition {
  const subjects = new Set<string>();
  questions.forEach(q => { if (q.subject) subjects.add(q.subject); });

  const sections: TestSection[] = [];
  let globalCounter = 0; 

  Array.from(subjects).forEach((subject) => {
    const subjectQuestions = questions.filter(q => q.subject === subject);
    const mcqs = subjectQuestions.filter(q => q.type !== 'Integer' && q.type !== 'Numerical');
    const nums = subjectQuestions.filter(q => q.type === 'Integer' || q.type === 'Numerical');

    if (mcqs.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} (Section A)`,
        subject: subject,
        questions: mcqs.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
      });
    }

    if (nums.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} (Section B)`,
        subject: subject,
        questions: nums.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
      });
    }
  });

  return {
    id: paperId,
    title: "JEE Test",
    durationSeconds: 180 * 60, 
    sections: sections,
  };
}

function mapSingleQuestion(q: BackendQuestion, globalIndex: number, sectionId: string, localIndex: number): TestQuestion {
  const isInteger = q.type === 'Integer' || q.type === 'Numerical';
  const imgArray = Array.isArray(q.image) ? q.image : (q.image ? [q.image] : []);

  const optionsList: TestOption[] = [];
  if (!isInteger && q.options) {
    ['A', 'B', 'C', 'D'].forEach((lbl) => {
      // Safe casting using keyof
      const textKey = `option${lbl}text` as keyof BackendOptionsObject;
      const imgKey = `option${lbl}image` as keyof BackendOptionsObject;
      
      const optText = q.options[textKey];
      const optImgs = q.options[imgKey];

      optionsList.push({
        id: lbl,
        label: lbl,
        text: (typeof optText === 'string') ? optText : '',
        imageUrl: (Array.isArray(optImgs) && optImgs.length > 0) ? optImgs[0] : null
      });
    });
  }

  return {
    id: q.id,
    index: localIndex,
    globalQuestionNumber: globalIndex,
    kind: isInteger ? 'numerical' : 'single',
    contentText: q.content || "",
    images: imgArray, 
    contentImageUrl: imgArray.length > 0 ? imgArray[0] : null,
    options: optionsList,
    correctMarks: q.positiveMarks || 4,
    negativeMarks: q.negativeMarks || (isInteger ? 0 : -1), 
    sectionId: sectionId
  };
}