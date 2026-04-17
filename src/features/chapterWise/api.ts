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

export interface QuestionListItem {
  id: string;
  subjectId?: string;
  chapterId?: string;
  paperId?: string;
  class?: number;
  content: string; // The actual question text
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
  options?: QuestionOption; // Adding the options object
  solution?: QuestionSolution; // Adding the solution object
  attemptStatus: "Successfully attempted" | "Not successfully done" | "Unattempted" | string;
}

export interface ChapterInfoResponse {
  stats: ChapterStats;
  jeeMain: QuestionListItem[];
  jeeAdvanced: QuestionListItem[];
}

export async function fetchChapterInfo(chapterName: string): Promise<ChapterInfoResponse> {
  // Pass only the relative path because your authenticatedFetch prepends the BASE_URL
  const res = await authenticatedFetch(`/chapterWise/${encodeURIComponent(chapterName)}/info`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const json = await res.json();
  // Ensure we return the 'data' part of your standard response
  return json.data; 
}

export interface ChapterWiseAttemptPayload {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number; // Optional: if your backend tracks time
}

export async function submitChapterWiseAttempt(payload: ChapterWiseAttemptPayload) {
  const res = await authenticatedFetch(`/chapterWise/attempt`, { // ⚠️ Update this endpoint if needed
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit attempt: ${res.status}`);
  }

  return await res.json();
}