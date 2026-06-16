// src/features/chapterWise/api.ts
import { authenticatedFetch, ApiError } from "../auth/api";
import { useRateLimitStore } from "@/store/useRateLimitStore";

export interface ChapterStats {
  totalQuestions: number;
  totalMainQuestions: number;
  totalAdvancedQuestions: number;
  uniqueSolvedMainQuestions: number;
  uniqueSolvedAdvancedQuestions: number;
  totalUniqueSolved: number;
}

export interface QuestionOption {
  id?: string;
  questionId?: string;
  optionAtext?: string;
  optionAimage?: string[];
  optionBtext?: string;
  optionBimage?: string[];
  optionCtext?: string;
  optionCimage?: string[];
  optionDtext?: string;
  optionDimage?: string[];
}

export interface QuestionSolution {
  id?: string;
  questionId?: string;
  text?: string;
  videoUrl?: string | null;
  image?: string[];
}

export interface PaperInfo {
  id?: string;
  year?: number;
  month?: string;
  date?: string;
  shift?: string;
  mode?: string;
  session?: string;
  exam?: { name: string };
}

export interface QuestionListItem {
  id: string;
  subjectId?: string;
  chapterId?: string;
  paperId?: string;
  class?: number;
  content: string; 
  image?: string[];
  type: string;
  questionNumber: number;
  comprehensionContent?: string;
  comprehensionImage?: string[];
  positiveMarks?: number;
  negativeMarks?: number;
  isOutOfSyllabus?: boolean;
  isBonus?: boolean;
  correctAnswer: string[] | string;
  options?: QuestionOption; 
  solution?: QuestionSolution; 
  papers?: PaperInfo; 
  isBookmarked?: boolean;
  attemptStatus: "Successfully attempted" | "Not successfully done" | "Unattempted" | string;
}

export interface ChapterData {
  id: string;
  name: string;
  subjectId: string;
  group: string;
  class: number;
  chapterNumber: number;
  isJeeMain: boolean;
  isJeeAdvanced: boolean;
}

export interface ChapterInfoResponse {
  chapterId?: string;
  chapterName?: string;
  stats: ChapterStats;
  chapterData?: ChapterData; 
  jeeMain: QuestionListItem[];
  jeeAdvanced: QuestionListItem[];
}

export interface ChapterInfoAPIResponse {
  message: string;
  data: ChapterInfoResponse;
}

// --- STRICT RESPONSE HANDLER ---
async function handleJson<T>(res: Response): Promise<T> {
  // Trigger the global modal for rate limiting
  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

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
// API CALLS
// ==========================================

// 🔥 CORRECTED: Takes the chapterSlug (e.g., "structure-of-atom") and calls the /info endpoint
export async function fetchChapterInfo(chapterSlug: string): Promise<ChapterInfoResponse> {
  console.info(`[API: ChapterWise] Fetching questions for chapter: ${chapterSlug}`);
  
  const res = await authenticatedFetch(`/chapterWise/${encodeURIComponent(chapterSlug)}/info`, {
    method: 'GET'
  });

  const response = await handleJson<ChapterInfoAPIResponse>(res);
  return response.data; 
}

export interface ChapterWiseAttemptPayload {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number; 
}

export async function submitChapterWiseAttempt(payload: ChapterWiseAttemptPayload) {
  console.info(`[API: ChapterWise] Submitting attempt for question: ${payload.questionId}`);
  
  const res = await authenticatedFetch(`/chapterWise/attempt`, { 
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return await handleJson<{ message: string; success?: boolean }>(res);
}

export interface ChapterAttempt {
  id: string;
  questionId: string;
  studentId: string;
  questionStatus: string;
  isCorrect: boolean;
  marksObtained: number;
  timeSpent: number;
  userAnswer: string[];
  created_at: string;
  isAnalyzed: boolean;
  isPending: boolean;
}

export interface QuestionAttemptsResponse {
  chapterAttempts: ChapterAttempt[];
  testAttempts: unknown[]; 
}

export interface QuestionAttemptsAPIResponse {
  message: string;
  data: QuestionAttemptsResponse;
}

export async function fetchQuestionAttempts(questionId: string): Promise<QuestionAttemptsResponse> {
  console.info(`[API: ChapterWise] Fetching historical attempts for question: ${questionId}`);
  
  const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/attempts`, {
    method: 'GET'
  });

  const response = await handleJson<QuestionAttemptsAPIResponse>(res);
  return response.data;
}