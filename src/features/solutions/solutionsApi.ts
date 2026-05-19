import { authenticatedFetch, ApiError } from "@/features/auth/api";

// --- STRICT TYPES FOR SOLUTION PAYLOAD ---

export interface SolutionSession {
  testId: string;
  timeLeft: number;
  activeSection: string;
  activeQuestionId: string;
  status: string;
  startTime: string;
}

export interface SolutionPaper {
  id: string;
  examId: string;
  year: number;
  mode: string;
  month?: string;
  day?: string;
  date?: string;
  shift?: string;
  totalMarks: number;
  totalDuration: number;
  totalQuestions: number;
  exam: {
    name: string;
  };
}

export interface SolutionOption {
  id: string;
  questionId: string;
  optionAtext?: string;
  optionBtext?: string;
  optionCtext?: string;
  optionDtext?: string;
}

export interface SolutionExplanation {
  id: string;
  questionId: string;
  text: string;
  videoUrl?: string | null;
}

export interface AttemptStatus {
  userAnswer: string[];
  isVisited: boolean;
  markedForReview: boolean;
  timeSpent: number;
  status: "answered" | "notAnswered" | "visited" | "unattempted" | string;
}

export interface SolutionQuestion {
  id: string;
  class: number;
  content: string;
  type: string;
  questionNumber: number;
  comprehensionContent: string;
  positiveMarks: number;
  negativeMarks: number;
  isOutOfSyllabus: boolean;
  isBonus: boolean;
  correctAnswer: string[];
  options?: SolutionOption;
  solution?: SolutionExplanation;
  subject: string;
  chapter: string;
  isJeeMain: boolean;
  isJeeAdvanced: boolean;
  attemptStatus: AttemptStatus;
}

// The backend groups questions by Type inside the Subject
export interface SubjectGroup {
  SingleCorrect?: SolutionQuestion[];
  MultiCorrect?: SolutionQuestion[];
  Integer?: SolutionQuestion[];
  ComprehensionSingleCorrect?: SolutionQuestion[];
  ComprehensionMultiCorrect?: SolutionQuestion[];
  ComprehensionInteger?: SolutionQuestion[];
}

export interface SolutionDataPayload {
  session: SolutionSession;
  paper: SolutionPaper;
  Physics?: SubjectGroup;
  Chemistry?: SubjectGroup;
  Mathematics?: SubjectGroup;
}

export interface SolutionApiResponse {
  message: string;
  data: SolutionDataPayload;
  success: boolean;
}

// --- STRICT RESPONSE HANDLER ---
async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      const errorData = data as Record<string, unknown>;
      message = String(errorData.message);
    }
    throw new ApiError(message, res.status);
  }

  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
      return { ...wrapper, data: wrapper.data } as T;
    }
  }

  return data as T;
}

// ==========================================
// API CALL
// ==========================================

export const fetchTestSolutionData = async (testStatusId: string): Promise<SolutionApiResponse> => {
  console.info(`[API: Solutions] Fetching deep solution data for session: ${testStatusId}`);
  const res = await authenticatedFetch(`/testStatus/getPaper?testStatusId=${testStatusId}`, {
    method: "GET",
  });
  
  return handleJson<SolutionApiResponse>(res);
};