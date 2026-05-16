import { create } from 'zustand';
import { QuestionData } from "@/components/chapterwise/ChapterWiseInterface";
import { authenticatedFetch } from "@/features/auth/api";

interface ChapterPracticeState {
  questions: QuestionData[];
  activeQuestionId: string;
  userAnswers: Record<string, string>;
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
  initStore: (fetchedQuestions, initialQuestionId) => {
    const initialUserAnswers: Record<string, string> = {};
    const initialSubmissions: Record<string, boolean> = {};

    const perfectlyNumberedQuestions = fetchedQuestions.map((q, index) => ({
      ...q,
      number: index + 1
    }));

    perfectlyNumberedQuestions.forEach((q) => {
      if (q.userAnswer) initialUserAnswers[q.id] = q.userAnswer;
      if (q.status === "correct" || q.status === "incorrect" || q.status === "answered" || q.userAnswer) {
        initialSubmissions[q.id] = true;
      }
    });

    const startingId = perfectlyNumberedQuestions.find(q => q.id === initialQuestionId)?.id || perfectlyNumberedQuestions[0]?.id || "";

    set({
      questions: perfectlyNumberedQuestions,
      activeQuestionId: startingId,
      userAnswers: initialUserAnswers,
      submissions: initialSubmissions,
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
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: optionId }
    }));
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
  toggleBookmark: async (questionId) => {
    const isCurrentlyBookmarked = get().bookmarkedQuestions[questionId];

    // Instantly toggle the UI state so it feels lightning fast
    set((state) => ({
      bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: !isCurrentlyBookmarked }
    }));

    try {
      // 🔥 FIX 1: Dynamically choose the endpoint. 
      // If it WAS bookmarked, we want to remove it. If it WASN'T, we add it.
      // (Note: Adjust `/bookMarked/remove` if your backend uses a different URL or a DELETE method)
      const endpoint = isCurrentlyBookmarked ? `/bookMarked/remove` : `/bookMarked/add`;

      const res = await authenticatedFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ questionId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        // 🔥 FIX 2: Graceful Exception Handling for "Already Added"
        // If the frontend thought it wasn't bookmarked, but the backend says it already is,
        // then our optimistic UI (which just turned it ON) is actually correct! Do not revert.
        const errorString = String(errorData?.errors || "");
        if (!isCurrentlyBookmarked && errorString.includes("Already Added")) {
          console.log("Question was already bookmarked on the server. UI is now synced.");
          return; 
        }

        // 🔥 FIX 3: Stop using 'throw new Error'. Use console.warn and revert the UI.
        console.warn(`Backend rejected bookmark sync (${endpoint}). Details:`, errorData);
        set((state) => ({
          bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: isCurrentlyBookmarked }
        }));
      }
    } catch (err) {
      console.warn("Network error while bookmarking:", err);

      // Revert the UI if the network request completely failed
      set((state) => ({
        bookmarkedQuestions: { ...state.bookmarkedQuestions, [questionId]: isCurrentlyBookmarked }
      }));
    }
  },

  submitAnswer: async (questionId) => {
    const { userAnswers, questionTimes } = get();
    const selectedOption = userAnswers[questionId];
    
    if (!selectedOption) return;

    set((state) => ({
      submissions: { ...state.submissions, [questionId]: true },
      isTimerRunning: false // Auto-pause timer when submitted
    }));

    try {
      const timeSpent = questionTimes[questionId] || 0;
      
      const payload = {
        status: "answered", 
        timeSpent: timeSpent,
        userAnswerRaw: [selectedOption] 
      };

      const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // 🔥 FIX: Extract the actual backend error to see what went wrong
        const errorData = await res.json().catch(() => ({}));
        
        // 🔥 FIX: Use console.warn instead of console.error to prevent the Next.js Red Screen
        console.warn("Backend rejected the answer submission. Details:", {
          status: res.status,
          error: errorData
        });
      } else {
        console.log("Answer synced to backend successfully!");
      }
    } catch (err) {
      // 🔥 FIX: Use console.warn here as well
      console.warn("Network or code error while updating question:", err);
    }
  }
}));