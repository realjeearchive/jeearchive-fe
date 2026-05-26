import { authenticatedFetch, ApiError } from "@/features/auth/api";
import { useRateLimitStore } from "@/store/useRateLimitStore";

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

// --- STRICT RESPONSE HANDLER (Same pattern as analytics) ---
async function handleJson<T>(res: Response): Promise<T> {
  // 🚨 Trigger the global modal for rate limiting
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

  // Safe type narrowing
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

export const fetchBookmarkedQuestions = async (): Promise<BookmarkedQuestion[]> => {
  console.info("[API: Bookmarks] Fetching saved questions list...");
  const res = await authenticatedFetch(`/bookMarked/get`, {
    method: "GET",
  });

  const response = await handleJson<BookmarkListResponse>(res);
  return response.data || [];
};

export const removeBookmarkApi = async (questionId: string): Promise<void> => {
  console.info(`[API: Bookmarks] Removing bookmark: ${questionId}`);
  const res = await authenticatedFetch(`/bookMarked/remove?questionId=${encodeURIComponent(questionId)}`, {
    method: "DELETE",
  });

  await handleJson<{ message: string; success: boolean }>(res);
};