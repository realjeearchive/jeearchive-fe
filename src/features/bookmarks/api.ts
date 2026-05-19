import { authenticatedFetch, ApiError } from "@/features/auth/api";

export interface BookmarkOption {
  id: string;
  questionId: string;
  optionAtext?: string;
  optionBtext?: string;
  optionCtext?: string;
  optionDtext?: string;
}

export interface BookmarkedQuestion {
  id: string;
  subjectId: string;
  chapterId: string;
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
  options: BookmarkOption;
  // Fallback for UI if solution/status attached later
  solution?: { text: string };
  attemptStatus?: string; 
  subject: string;
  chapter: string;
  exam: string;
  paperTitle: string;
  createdAt: string;
}

export interface BookmarkListResponse {
  message: string;
  data: BookmarkedQuestion[];
  success?: boolean;
}

export const fetchBookmarkedQuestions = async (): Promise<BookmarkedQuestion[]> => {
  console.info("[API: Bookmarks] Fetching saved questions list...");
  const res = await authenticatedFetch(`/bookMarked/get`, {
    method: "GET",
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError("Failed to fetch bookmarks", res.status);
  }

  const wrapper = json as BookmarkListResponse;
  return wrapper.data || [];
};

export const removeBookmarkApi = async (questionId: string): Promise<void> => {
  console.info(`[API: Bookmarks] Removing bookmark: ${questionId}`);
  const res = await authenticatedFetch(`/bookMarked/remove?questionId=${encodeURIComponent(questionId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new ApiError("Failed to remove bookmark", res.status);
  }
};