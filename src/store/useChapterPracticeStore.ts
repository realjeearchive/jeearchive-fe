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
  
  isTimerRunning: boolean;
  bookmarkedQuestions: Record<string, boolean>;

  initStore: (questions: QuestionData[], initialQuestionId?: string) => void;
  setActiveQuestionId: (id: string) => void;
  selectOption: (questionId: string, optionId: string) => void;
  submitAnswer: (questionId: string) => Promise<void>;
  revealSolution: (questionId: string) => void;
  incrementTime: (questionId: string) => void;
  
  toggleTimer: () => void;
  toggleBookmark: (questionId: string) => Promise<void>;
}

export const useChapterPracticeStore = create<ChapterPracticeState>((set, get) => ({
  questions: [],
  activeQuestionId: "",
  userAnswers: {},
  submissions: {},
  revealedSolutions: {},
  questionTimes: {},
  isTimerRunning: false,
  bookmarkedQuestions: {}, 

  initStore: (fetchedQuestions, initialQuestionId) => {
    const initialUserAnswers: Record<string, string | string[]> = {};
    const initialSubmissions: Record<string, boolean> = {};
    const initialBookmarks: Record<string, boolean> = {}; 

    const perfectlyNumberedQuestions = fetchedQuestions.map((q, index) => ({
      ...q,
      number: index + 1
    }));

    perfectlyNumberedQuestions.forEach((q) => {
      // 🔥 FIX: Strict check! Prevent empty arrays [] or empty strings "" from acting as a real answer
      const hasAnswer = q.userAnswer !== null && q.userAnswer !== undefined && 
                        (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0) &&
                        q.userAnswer !== "";

      if (hasAnswer) {
        initialUserAnswers[q.id] = q.userAnswer as string | string[];
      }
      
      // Only mark as submitted if the status explicitly says so, or if they actually answered it
      if (q.status === "correct" || q.status === "incorrect" || q.status === "answered" || hasAnswer) {
        initialSubmissions[q.id] = true;
      }
      
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
      bookmarkedQuestions: initialBookmarks,
      revealedSolutions: {},
      questionTimes: { [startingId]: 0 }, // Reset time for initial question
      isTimerRunning: true, // Always start timer
    });
  },

  setActiveQuestionId: (id) => set((state) => {
    return {
      activeQuestionId: id,
      isTimerRunning: true, // Always start timer on navigation
      questionTimes: { ...state.questionTimes, [id]: 0 } // Reset time to 0
    };
  }),

  selectOption: (questionId, optionId) => {
    set((state) => {
      const question = state.questions.find((q) => q.id === questionId);
      const isMulti = question?.section.toLowerCase().includes("multi");

      const current = state.userAnswers[questionId];
      let nextAnswer: string | string[];

      if (isMulti) {
        const arr = Array.isArray(current) ? current : (current ? [current as string] : []);
        if (arr.includes(optionId)) {
          nextAnswer = arr.filter((id) => id !== optionId); 
        } else {
          nextAnswer = [...arr, optionId].sort(); 
        }
      } else {
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

  toggleBookmark: async (questionId) => {
    const isCurrentlyBookmarked = !!get().bookmarkedQuestions[questionId];

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
      toast.error("Bookmark not saved. Check your connection.");      
      set((state) => ({
        bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: isCurrentlyBookmarked }
      }));
    }
  },

  submitAnswer: async (questionId) => {
    const { userAnswers, questionTimes } = get();
    const selectedOption = userAnswers[questionId];
    
    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) return;

    set((state) => ({
      submissions: { ...state.submissions, [questionId]: true },
      isTimerRunning: false 
    }));

    try {
      const payload = {
        status: "answered", 
        timeSpent: questionTimes[questionId] || 0,
        userAnswerRaw: Array.isArray(selectedOption) ? selectedOption : [selectedOption] 
      };

      const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Backend rejection");
      
    } catch (err) {
      console.warn("[ChapterPractice] Submit error:", err);
      toast.error("Network issue. Couldn't save answer."); 
      
      set((state) => ({
        submissions: { ...state.submissions, [questionId]: false }
      }));
    }
  }
}));