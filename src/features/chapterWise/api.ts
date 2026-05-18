import { authenticatedFetch } from "../auth/api";

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
  const res = await authenticatedFetch(`/chapterWise/${encodeURIComponent(chapterName)}/info`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
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
  const res = await authenticatedFetch(`/chapterWise/attempt`, { 
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit attempt: ${res.status}`);
  }

  return await res.json();
}


// --- NEW: Types for Question Attempts History ---
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
  testAttempts: any[]; // You can type this later if needed
}

export async function fetchQuestionAttempts(questionId: string): Promise<QuestionAttemptsResponse> {
  const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/attempts`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch attempts: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}