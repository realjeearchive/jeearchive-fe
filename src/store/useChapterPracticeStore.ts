import { create } from 'zustand';
import { QuestionData } from "@/components/chapterwise/ChapterWiseInterface";
import { authenticatedFetch } from "@/features/auth/api";
import { toast } from "sonner";

interface ChapterPracticeState {
  questions: QuestionData[];
  activeQuestionId: string;
  userAnswers: Record<string, string | string[]>;
  submissions: Record<string, boolean>;
  revealedSolutions: Record<string, boolean>;
  questionTimes: Record<string, number>;
  
  // 🔥 New UI States
  isTimerRunning: boolean;
  bookmarkedQuestions: Record<string, boolean>;

  // Actions
  initStore: (questions: QuestionData[], initialQuestionId?: string) => void;
  setActiveQuestionId: (id: string) => void;
  selectOption: (questionId: string, optionId: string) => void;
  submitAnswer: (questionId: string) => Promise<void>;
  revealSolution: (questionId: string) => void;
  incrementTime: (questionId: string) => void;
  
  // 🔥 New Actions
  toggleTimer: () => void;
  toggleBookmark: (questionId: string) => Promise<void>;
}

export const useChapterPracticeStore = create<ChapterPracticeState>((set, get) => ({
  // --- Initial State ---
  questions: [],
  activeQuestionId: "",
  userAnswers: {},
  submissions: {},
  revealedSolutions: {},
  questionTimes: {},
  isTimerRunning: false,
  bookmarkedQuestions: {}, 

  // --- Actions ---
// --- Actions ---
initStore: (fetchedQuestions, initialQuestionId) => {
    const initialUserAnswers: Record<string, string> = {};
    const initialSubmissions: Record<string, boolean> = {};
    const initialBookmarks: Record<string, boolean> = {}; 

    const perfectlyNumberedQuestions = fetchedQuestions.map((q, index) => ({
      ...q,
      number: index + 1
    }));

    perfectlyNumberedQuestions.forEach((q) => {
      if (q.userAnswer) initialUserAnswers[q.id] = q.userAnswer;
      if (q.status === "correct" || q.status === "incorrect" || q.status === "answered" || q.userAnswer) {
        initialSubmissions[q.id] = true;
      }
      // 🔥 STRICT CHECK: Load backend bookmark state instantly
      if (q.isBookmarked === true) {
        initialBookmarks[q.id] = true;
      }
    });

    const startingId = perfectlyNumberedQuestions.find(q => q.id === initialQuestionId)?.id || perfectlyNumberedQuestions[0]?.id || "";

    set({
      questions: perfectlyNumberedQuestions,
      activeQuestionId: startingId,
      userAnswers: initialUserAnswers,
      submissions: initialSubmissions,
      bookmarkedQuestions: initialBookmarks, // 🔥 Injects the true/false states into the UI
      revealedSolutions: {},
      questionTimes: {},
      isTimerRunning: false, 
    });
  },

  setActiveQuestionId: (id) => set({ 
    activeQuestionId: id,
    isTimerRunning: false // Auto-pause timer when switching questions
  }),

  selectOption: (questionId, optionId) => {
    set((state) => {
      const question = state.questions.find((q) => q.id === questionId);
      const isMulti = question?.section.toLowerCase().includes("multi");

      const current = state.userAnswers[questionId];
      let nextAnswer: string | string[];

      if (isMulti) {
        // Multi-correct: Toggle the option in an array
        const arr = Array.isArray(current) ? current : (current ? [current as string] : []);
        if (arr.includes(optionId)) {
          nextAnswer = arr.filter((id) => id !== optionId); // Remove if exists
        } else {
          nextAnswer = [...arr, optionId].sort(); // Add and sort (e.g., ["A", "C"])
        }
      } else {
        // Single/Numerical: Just replace it
        nextAnswer = optionId;
      }

      return { userAnswers: { ...state.userAnswers, [questionId]: nextAnswer } };
    });
  },

  revealSolution: (questionId) => {
    set((state) => ({
      revealedSolutions: { ...state.revealedSolutions, [questionId]: true }
    }));
  },

  incrementTime: (questionId) => {
    set((state) => ({
      questionTimes: { ...state.questionTimes, [questionId]: (state.questionTimes[questionId] || 0) + 1 }
    }));
  },

  toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),

  // 🔥 Optimistic UI Bookmark Action
// 🔥 Optimistic UI Bookmark Action
  // 🔥 Optimistic UI Bookmark Action
  toggleBookmark: async (questionId) => {
    const isCurrentlyBookmarked = !!get().bookmarkedQuestions[questionId];

    // 1. Instantly toggle UI state for that snappy feel
    set((state) => ({
      bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: !isCurrentlyBookmarked }
    }));

    try {
      if (!isCurrentlyBookmarked) {
        const res = await authenticatedFetch(`/bookMarked/add`, {
          method: "POST",
          body: JSON.stringify({ questionId }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          if (errorData?.errors?.includes("Already Added")) return;
          throw new Error("Failed to add bookmark");
        }
      } else {
        const res = await authenticatedFetch(`/bookMarked/remove?questionId=${encodeURIComponent(questionId)}`, {
          method: "DELETE", 
        });

        if (!res.ok) {
          throw new Error("Failed to remove bookmark");
        }
      }
    } catch (err) {
      console.warn("[ChapterPractice] Bookmark sync error:", err);
      // 🔥 STUDENT-FRIENDLY TOAST
      toast.error("Bookmark not saved. Check your connection.");      
      // Revert UI on failure so it doesn't lie to the user
      set((state) => ({
        bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: isCurrentlyBookmarked }
      }));
    }
  },

  submitAnswer: async (questionId) => {
    const { userAnswers, questionTimes } = get();
    const selectedOption = userAnswers[questionId];
    
    // Prevent empty array submission
    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) return;

    set((state) => ({
      submissions: { ...state.submissions, [questionId]: true },
      isTimerRunning: false 
    }));

    try {
      const payload = {
        status: "answered", 
        timeSpent: questionTimes[questionId] || 0,
        // 🔥 Safely wrap in array for the backend
        userAnswerRaw: Array.isArray(selectedOption) ? selectedOption : [selectedOption] 
      };

      const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Backend rejection");
      
    } catch (err) {
      console.warn("[ChapterPractice] Submit error:", err);
      toast.error("Network issue. Couldn't save answer."); // 🔥 SHORT TOAST
      
      set((state) => ({
        submissions: { ...state.submissions, [questionId]: false }
      }));
    }
  }
}));