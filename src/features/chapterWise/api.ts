// src/features/chapterWise/api.ts
import { authenticatedFetch, ApiError } from "../auth/api";
// 🚨 NEW: Import the rate limit store
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

// 🔥 NEW: Paper interface to extract Year, Month, Session, and Shift for the filter
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
  isBookmarked?: boolean; // 🔥 NEW: Added from backend
  attemptStatus: "Successfully attempted" | "Not successfully done" | "Unattempted" | string;
}

// 🔥 NEW: Chapter Data interface to read the Syllabus boolean flags
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
  chapterData?: ChapterData; // 🔥 Attached chapter data for syllabus tags
  jeeMain: QuestionListItem[];
  jeeAdvanced: QuestionListItem[];
}

export async function fetchChapterInfo(chapterName: string): Promise<ChapterInfoResponse> {
  console.info(`[API: ChapterWise] Fetching data for chapter: ${chapterName}`);
  const res = await authenticatedFetch(`/chapterWise/${encodeURIComponent(chapterName)}/info`, {
    method: 'GET'
  });

  // 🚨 NEW: 429 Interceptor
  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  if (!res.ok) {
    console.error(`[API: ChapterWise] Failed to fetch chapter info. Status: ${res.status}`);
    throw new ApiError(`Failed to fetch: ${res.status}`, res.status);
  }

  const json = await res.json();
  return json.data; 
}

export interface ChapterWiseAttemptPayload {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number; 
}

// (Optional: You can remove this if you strictly use the fetch call directly inside Zustand now)
export async function submitChapterWiseAttempt(payload: ChapterWiseAttemptPayload) {
  console.info(`[API: ChapterWise] Submitting attempt for question: ${payload.questionId}`);
  const res = await authenticatedFetch(`/chapterWise/attempt`, { 
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // 🚨 NEW: 429 Interceptor
  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  if (!res.ok) {
    console.error(`[API: ChapterWise] Attempt submission failed. Status: ${res.status}`);
    throw new ApiError(`Failed to submit attempt: ${res.status}`, res.status);
  }

  return await res.json();
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

export async function fetchQuestionAttempts(questionId: string): Promise<QuestionAttemptsResponse> {
  console.info(`[API: ChapterWise] Fetching historical attempts for question: ${questionId}`);
  const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/attempts`, {
    method: 'GET'
  });

  // 🚨 NEW: 429 Interceptor
  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  if (!res.ok) {
    console.error(`[API: ChapterWise] Failed to fetch historical attempts. Status: ${res.status}`);
    throw new ApiError(`Failed to fetch attempts: ${res.status}`, res.status);
  }

  const json = await res.json();
  return json.data;
}