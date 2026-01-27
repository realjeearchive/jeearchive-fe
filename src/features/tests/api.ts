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

  // FIXED: Strict Spread logic for Tests API
  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    // Ensure inner data is object and NOT array
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
        // 
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

// --- MAPPERS (Unchanged) ---
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

export function mapSingleQuestion(q: BackendQuestion, globalIndex: number, sectionId: string, localIndex: number): TestQuestion {
  let kind: TestQuestion['kind'] = 'single';
  const typeStr = q.type.toLowerCase();
  
  if (typeStr.includes('integer') || typeStr.includes('numerical')) kind = 'numerical';
  else if (typeStr.includes('multi')) kind = 'multi';
  else if (typeStr.includes('comprehension')) kind = 'comprehension';

  const imgArray = Array.isArray(q.image) ? q.image : (q.image ? [q.image] : []);

  const optionsList: TestOption[] = [];
  if (kind !== 'numerical' && q.options) {
    ['A', 'B', 'C', 'D'].forEach((lbl) => {
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
    kind: kind,
    contentText: q.content || "",
    images: imgArray, 
    contentImageUrl: imgArray.length > 0 ? imgArray[0] : null,
    options: optionsList,
    correctMarks: q.positiveMarks || 4,
    negativeMarks: q.negativeMarks || (kind === 'numerical' ? 0 : -1), 
    sectionId: sectionId
  };
}