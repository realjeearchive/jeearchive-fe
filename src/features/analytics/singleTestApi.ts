// src/features/analytics/singleTestApi.ts
import { authenticatedFetch, ApiError } from "@/features/auth/api";

// --- STRICT TYPES FOR SINGLE TEST ANALYTICS ---

export interface SubjectAnalytics {
  totalQuestions: number;
  attempt: number;
  marks: number;
  timeTaken: number;
  positiveMarks: number;
  paritalMarks: number; // Note: 'paritalMarks' is spelled this way in the backend JSON
  negativeMarks: number;
  correct: number;
  partial: number;
  wrong: number;
  accuracy: number;
}

export interface OverallAnalytics {
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalPartial: number;
  overallAccuracy: number;
  totalTimeTaken: number;
  averageTimePerQuestion: number;
}

export interface QuestionTypeAnalytics {
  totalQuestions: number;
  attempt: number;
  correct: number;
  partial: number;
  wrong: number;
  positiveMarks: number;
  partialMarks: number;
  negativeMarks: number;
  marks: number;
  timeTaken: number;
  accuracy: number;
}

export interface ChapterWiseAnalytics {
  chapterId: string;
  chapterName: string;
  subjectName: string;
  totalQuestions: number;
  attempt: number;
  correct: number;
  partial: number;
  wrong: number;
  positiveMarks: number;
  partialMarks: number;
  negativeMarks: number;
  marks: number;
  timeTaken: number;
  accuracy: number;
}

export interface FinalVerdictItem {
  questionId: string;
  type: string;
  isVisited: boolean;
  timeSpent: number;
  markedForReview: boolean;
  userAnswer: string[];
  verdict: "correct" | "wrong" | "unattempted" | "partial"; // Assuming these are the possible values based on standard logic
  marks: number;
  totalPositiveMarks: number;
  totalNegativeMarks: number;
  subject: string;
  chapterId: string;
  chapterName: string;
}

export interface SingleTestPayload {
  exam: string;
  math: SubjectAnalytics;
  physics: SubjectAnalytics;
  chemistry: SubjectAnalytics;
  overall: OverallAnalytics;
  questionTypes: Record<string, QuestionTypeAnalytics>;
  chapterWise: ChapterWiseAnalytics[];
  finalVerdict: FinalVerdictItem[];
}

export interface SingleTestApiResponse {
  message: string;
  data: SingleTestPayload;
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

export const fetchSingleTestAnalytics = async (testId: string, createdAt: string): Promise<SingleTestApiResponse> => {
  const encodedDate = encodeURIComponent(createdAt);
  console.info(`[API: Analytics] Fetching deep test analytics. ID: ${testId}, Timestamp: ${createdAt}`);
  
  const res = await authenticatedFetch(
    `/analytics/test?testId=${testId}&created_at=${encodedDate}`, 
    { method: 'GET' }
  );
  
  return handleJson<SingleTestApiResponse>(res);
};