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

  // Actions
  initStore: (questions: QuestionData[], initialQuestionId?: string) => void;
  setActiveQuestionId: (id: string) => void;
  selectOption: (questionId: string, optionId: string) => void;
  submitAnswer: (questionId: string) => Promise<void>;
  revealSolution: (questionId: string) => void;
  incrementTime: (questionId: string) => void;
}

export const useChapterPracticeStore = create<ChapterPracticeState>((set, get) => ({
  questions: [],
  activeQuestionId: "",
  userAnswers: {},
  submissions: {},
  revealedSolutions: {},
  questionTimes: {},

  initStore: (fetchedQuestions, initialQuestionId) => {
    const initialUserAnswers: Record<string, string> = {};
    const initialSubmissions: Record<string, boolean> = {};

    // 🔥 THE ULTIMATE FIX: Force strict 1 to N sequential numbering!
    // This permanently overwrites the chaotic random exam numbers from the backend.
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
    });
  },

  setActiveQuestionId: (id) => set({ activeQuestionId: id }),

  selectOption: (questionId, optionId) => {
    const { submissions } = get();
    if (submissions[questionId]) return; 
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

  submitAnswer: async (questionId) => {
    const { userAnswers, questionTimes } = get();
    const selectedOption = userAnswers[questionId];
    
    if (!selectedOption) return;

    set((state) => ({
      submissions: { ...state.submissions, [questionId]: true }
    }));

    try {
      const timeSpent = questionTimes[questionId] || 0;
      
      const payload = {
        status: "visited", 
        timeSpent: timeSpent,
        userAnswer: [selectedOption] 
      };

      const res = await authenticatedFetch(`/chapterWise/questions/${questionId}/update`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to sync answer to backend");
      } else {
        console.log("Answer synced to backend successfully!");
      }
    } catch (err) {
      console.error("Error updating question:", err);
    }
  }
}));