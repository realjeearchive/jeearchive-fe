import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TestDefinition, TestSection } from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";

// --- HELPER: Save to LocalStorage ---
const saveToLocal = (state: TestEngineState) => {
  if (!state.testId) return;
  
  // We save the critical data needed to restore the session
  const payload = {
    testId: state.testId,
    questionsById: state.questionsById,
    timeLeftSeconds: state.timeLeftSeconds,
    activeQuestionId: state.activeQuestionId,
    activeSectionId: state.activeSectionId,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(`test_progress_${state.testId}`, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to save progress to local storage", e);
  }
};

interface TestEngineState {
  // --- STATE ---
  isInitialized: boolean;
  testId: string | null;
  title: string;
  sections: TestSection[];
  timeLeftSeconds: number;
  activeSectionId: string | null;
  activeQuestionId: string | null;
  questionsById: Record<string, QuestionState>;

  // --- ACTIONS ---
  initFromDefinition: (def: TestDefinition) => void;
  
  // NEW: Restore from LocalStorage
  restoreSession: (savedData: any, def: TestDefinition) => void; 
  
  setActiveSectionId: (sectionId: string) => void;
  jumpToQuestion: (questionId: string) => void;
  selectOption: (questionId: string, value: string) => void;
  
  saveAndNext: () => void;
  markForReview: () => void;
  clearResponse: () => void;
  
  tickTimer: () => void;
  submitTest: () => void;
  syncWithServer: () => Promise<void>;
}

export const useTestEngineStore = create<TestEngineState>()(
  devtools((set, get) => ({
    // Initial State
    isInitialized: false,
    testId: null,
    title: "",
    sections: [],
    timeLeftSeconds: 0,
    activeSectionId: null,
    activeQuestionId: null,
    questionsById: {},

    // --- 1. SETUP ---
    initFromDefinition: (def) => {
      const initialQuestionsState: Record<string, QuestionState> = {};
      
      def.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          initialQuestionsState[q.id] = {
            questionId: q.id,
            globalQuestionNumber: q.globalQuestionNumber,
            status: "notVisited",
            selectedOptionIds: [],
            numericAnswer: null,
            isVisited: false,
          };
        });
      });

      const firstSection = def.sections[0];
      const firstQuestion = firstSection?.questions[0];

      if (firstQuestion) {
        initialQuestionsState[firstQuestion.id].isVisited = true;
        initialQuestionsState[firstQuestion.id].status = "notAnswered";
      }

      const newState = {
        isInitialized: true,
        testId: def.id,
        title: def.title,
        sections: def.sections,
        timeLeftSeconds: def.durationSeconds,
        activeSectionId: firstSection?.id || null,
        activeQuestionId: firstQuestion?.id || null,
        questionsById: initialQuestionsState,
      };

      set(newState);
      // We don't saveToLocal here yet, user hasn't done anything.
    },

    // --- NEW: RESTORE SESSION ---
    restoreSession: (savedData, def) => {
      // 1. We still need the definition for structure (sections, labels, correct marks etc)
      // but we overwrite the dynamic parts (answers, time) from savedData.
      
      set({
        isInitialized: true,
        testId: def.id,
        title: def.title,
        sections: def.sections, // Structure comes from API
        
        // Restore Dynamic Data
        timeLeftSeconds: savedData.timeLeftSeconds,
        activeSectionId: savedData.activeSectionId,
        activeQuestionId: savedData.activeQuestionId,
        questionsById: savedData.questionsById,
      });
      
      console.log("Session Restored from LocalStorage");
    },

    // --- 2. NAVIGATION ---
    setActiveSectionId: (sectionId) => {
      const { sections } = get();
      const targetSection = sections.find((s) => s.id === sectionId);
      if (!targetSection || !targetSection.questions.length) return;

      const firstQ = targetSection.questions[0];
      const qId = firstQ.id;

      set((state) => {
        const newQs = { ...state.questionsById };
        if (newQs[qId].status === "notVisited") {
          newQs[qId].status = "notAnswered";
          newQs[qId].isVisited = true;
        }
        
        const nextState = {
          activeSectionId: sectionId,
          activeQuestionId: qId,
          questionsById: newQs,
        };
        
        // Save navigation change? Optional, but good for resuming exactly where left off.
        saveToLocal({ ...state, ...nextState });
        
        return nextState;
      });
    },

    jumpToQuestion: (questionId) => {
      set((state) => {
        const newQs = { ...state.questionsById };
        if (newQs[questionId].status === "notVisited") {
          newQs[questionId].status = "notAnswered";
          newQs[questionId].isVisited = true;
        }

        const section = state.sections.find((s) => 
          s.questions.some((q) => q.id === questionId)
        );

        const nextState = {
          activeQuestionId: questionId,
          activeSectionId: section?.id || state.activeSectionId,
          questionsById: newQs,
        };
        
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });
    },

    // --- 3. INTERACTION (CRITICAL SAVE POINT) ---
    selectOption: (questionId, value) => {
      const { sections } = get();
      const section = sections.find(s => s.questions.some(q => q.id === questionId));
      const questionDef = section?.questions.find(q => q.id === questionId);
      const isNumerical = questionDef?.kind === "numerical";

      set((state) => {
        const prev = state.questionsById[questionId];
        const newState = { ...prev };

        if (isNumerical) {
          newState.numericAnswer = value; 
        } else {
          newState.selectedOptionIds = [value]; 
        }

        const nextState = {
          questionsById: {
            ...state.questionsById,
            [questionId]: newState,
          },
        };

        // INSTANT LOCAL SAVE
        saveToLocal({ ...state, ...nextState });

        return nextState;
      });
    },

    // --- 4. BUTTON LOGIC ---
    saveAndNext: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;

      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = 
        currentQ.selectedOptionIds.length > 0 || 
        (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");

      const newStatus: QuestionStatus = hasAnswer ? "answered" : "notAnswered";

      set((state) => {
        const nextState = {
          questionsById: {
            ...state.questionsById,
            [activeQuestionId]: {
              ...state.questionsById[activeQuestionId],
              status: newStatus,
            },
          },
        };
        
        // Save before moving
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });

      moveToNextQuestion(get, set);
    },

    markForReview: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;

      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = 
        currentQ.selectedOptionIds.length > 0 || 
        (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");

      const newStatus: QuestionStatus = hasAnswer 
        ? "answeredAndMarked" 
        : "markedForReview";

      set((state) => {
        const nextState = {
          questionsById: {
            ...state.questionsById,
            [activeQuestionId]: {
              ...state.questionsById[activeQuestionId],
              status: newStatus,
            },
          },
        };
        
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });

      moveToNextQuestion(get, set);
    },

    clearResponse: () => {
      const { activeQuestionId } = get();
      if (!activeQuestionId) return;

      set((state) => {
        // 1. Explicitly type the new status
        const newStatus: QuestionStatus = "notAnswered";

        const nextState = {
          questionsById: {
            ...state.questionsById,
            [activeQuestionId]: {
              ...state.questionsById[activeQuestionId],
              selectedOptionIds: [],
              numericAnswer: null,
              status: newStatus, // Now TS knows this is valid
            },
          },
        };
        
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });
    },

    // --- 5. SYSTEM ---
    tickTimer: () => {
      const { timeLeftSeconds, submitTest } = get();
      if (timeLeftSeconds <= 0) {
        submitTest();
        return;
      }
      
      // OPTIONAL: We can save time every 10 seconds to avoid spamming disk I/O
      // but strictly speaking, browsers handle this fine.
      // For now, let's NOT save on every tick to keep performance high. 
      // We rely on the "Periodic Server Sync" or user interaction to save time checkpoints.
      
      set({ timeLeftSeconds: timeLeftSeconds - 1 });
    },

    // --- 6. SERVER SYNC (Heartbeat) ---
    syncWithServer: async () => {
      const { testId, questionsById, timeLeftSeconds, activeQuestionId, activeSectionId } = get();
      if (!testId) return;

      const payload = {
        testId,
        timeLeftSeconds,
        activeQuestionId,
        activeSectionId,
        questionsById, // Sends the entire map (simplest for now)
        timestamp: Date.now(),
      };

      try {
        await fetch("/api/tests/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("Auto-saved to server");
      } catch (err) {
        console.warn("Server sync failed (offline?), data remains safe in LocalStorage");
      }
    },

    submitTest: () => {
      // Clear local storage on submit so user can't "resume" a finished test
      const { testId } = get();
      if (testId) {
        localStorage.removeItem(`test_progress_${testId}`);
      }
      
      console.log("Test Submitted!");
      alert("Test Submitted Successfully!");
    },
  }),
  { name: "TestEngineStore" }
  )
);

// --- HELPER FOR "NEXT" LOGIC ---
function moveToNextQuestion(
  get: () => TestEngineState, 
  set: (fn: (state: TestEngineState) => Partial<TestEngineState>) => void
) {
  const { sections, activeQuestionId } = get();
  
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    const nextQ = allQuestions[currentIndex + 1];
    
    set((state) => {
      const newQs = { ...state.questionsById };
      
      if (newQs[nextQ.id].status === "notVisited") {
        newQs[nextQ.id] = {
          ...newQs[nextQ.id],
          status: "notAnswered",
          isVisited: true
        };
      }
      
      const nextSectionId = nextQ.sectionId;

      const nextState = {
        activeQuestionId: nextQ.id,
        activeSectionId: nextSectionId,
        questionsById: newQs,
      };

      // Save the move
      saveToLocal({ ...state, ...nextState });

      return nextState;
    });
  } else {
    console.log("End of questions reached");
  }
}