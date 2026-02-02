// src/features/tests/api.ts
import { decryptData } from "@/lib/decrypt";
import { authenticatedFetch, ApiError } from "@/features/auth/api"; 
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

// --- RESPONSE HANDLER ---
async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      message = String((data as { message: unknown }).message);
    }
    throw new ApiError(message, res.status);
  }

  // Strict Spread logic
  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
        return { ...wrapper, ...(wrapper.data as object) } as T;
    }
  }

  return data as T;
}

// ==========================================
// API CALLS
// ==========================================

export async function fetchPapersByYear(params: { 
  year: string; 
  accessToken: string; 
  examName?: 'JEE_MAIN' | 'JEE_ADVANCED'; 
}) {
  const res = await authenticatedFetch(
    `/paper/get?year=${params.year}&examName=${params.examName || 'JEE_MAIN'}`, 
    { method: 'GET' }
  );
  return handleJson<PaperApiResponse>(res);
}

export async function fetchTestContent(paperId: string): Promise<TestDefinition | null> {
  const res = await authenticatedFetch(`/question/paperQuestions/${paperId}`, {
    method: 'GET',
  });

  const json = await handleJson<{ data: string }>(res);
  const decryptedData = decryptData<unknown>(json.data);

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

export async function fetchLastTestStatus(paperId: string) {
  const res = await authenticatedFetch(`/testStatus/lastTestDetails?paperId=${paperId}`, {
    method: 'GET'
  });
  return handleJson<LastTestStatusResponse>(res);
}

export async function createTestSession(paperId: string) {
  const res = await authenticatedFetch(`/testStatus/create`, {
    method: 'POST',
    body: JSON.stringify({ paperId }),
  });
  return handleJson<CreateTestResponse>(res);
}

export async function fetchTestSession(testStatusId: string) {
  const res = await authenticatedFetch(`/testStatus/getPaper?testStatusId=${testStatusId}`, {
    method: 'GET'
  });
  return handleJson<SessionDataResponse>(res);
}

export async function updateTestSession(payload: UpdateTestStatusPayload) {
  const res = await authenticatedFetch(`/testStatus/update`, {
    method: 'POST',
    body: JSON.stringify(payload),
    keepalive: true, 
  });
  return handleJson<{ success: boolean; message: string }>(res);
}

// ==========================================
// MAPPERS
// ==========================================

function mapBackendDataToDefinition(paperId: string, questions: BackendQuestion[]): TestDefinition {
  // 1. Sort global list by questionNumber first to ensure correct flow
  questions.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));

  const subjects = new Set<string>();
  questions.forEach(q => { if (q.subject) subjects.add(q.subject); });

  const sections: TestSection[] = [];
  let globalCounter = 0; 

  Array.from(subjects).forEach((subject) => {
    const subjectQuestions = questions.filter(q => q.subject === subject);
    
    // Group by Type (JEE Advanced style)
    // 1. MCQs (Single Correct)
    const singleCorrect = subjectQuestions.filter(q => q.type?.toLowerCase().includes('single'));
    // 2. Multi Correct
    const multiCorrect = subjectQuestions.filter(q => q.type?.toLowerCase().includes('multi'));
    // 3. Numericals
    const numericals = subjectQuestions.filter(q => q.type?.toLowerCase().includes('integer') || q.type?.toLowerCase().includes('numerical'));
    // 4. Comprehension
    const comprehensions = subjectQuestions.filter(q => q.type?.toLowerCase().includes('comprehension'));

    // Create Sections based on data presence
    if (singleCorrect.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} - Single Correct`,
        subject: subject,
        questions: singleCorrect.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
      });
    }

    if (multiCorrect.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} - Multi Correct`,
        subject: subject,
        questions: multiCorrect.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
      });
    }

    if (comprehensions.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} - Comprehension`,
        subject: subject,
        questions: comprehensions.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
      });
    }

    if (numericals.length > 0) {
      const sectionId = `sec-${sections.length}`;
      sections.push({
        id: sectionId,
        label: `${subject} - Numerical`,
        subject: subject,
        questions: numericals.map((q, idx) => mapSingleQuestion(q, ++globalCounter, sectionId, idx + 1))
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

export function mapSingleQuestion(q: BackendQuestion, globalIndex: number, sectionId: string, localIndex: number): TestQuestion {
  let kind: TestQuestion['kind'] = 'single';
  const typeStr = q.type ? q.type.toLowerCase() : "";
  
  // Robust Kind Detection
  if (typeStr.includes('integer') || typeStr.includes('numerical')) kind = 'numerical';
  else if (typeStr.includes('multi')) kind = 'multi';
  else if (typeStr.includes('comprehension')) kind = 'comprehension';

  const imgArray = Array.isArray(q.image) ? q.image : (q.image ? [q.image] : []);

  const optionsList: TestOption[] = [];
  
  // Populate options for Single, Multi, and Comprehension
  if (kind !== 'numerical' && q.options) {
    ['A', 'B', 'C', 'D'].forEach((lbl) => {
      const textKey = `option${lbl}text` as keyof BackendOptionsObject;
      const imgKey = `option${lbl}image` as keyof BackendOptionsObject;
      
      const optText = q.options![textKey];
      const optImgs = q.options![imgKey];

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
    // Use backend questionNumber if available for ordering, fallback to counter
    globalQuestionNumber: q.questionNumber || globalIndex,
    kind: kind,
    contentText: q.content || "",
    // NEW: Map Comprehension Passage
    comprehensionContent: q.comprehensionContent || null,
    images: imgArray, 
    contentImageUrl: imgArray.length > 0 ? imgArray[0] : null,
    options: optionsList,
    correctMarks: q.positiveMarks || 4,
    negativeMarks: q.negativeMarks || (kind === 'numerical' ? 0 : -1), 
    sectionId: sectionId
  };
}