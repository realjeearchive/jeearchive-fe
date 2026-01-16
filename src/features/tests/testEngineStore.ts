import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TestDefinition, TestSection } from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";

// --- TYPES ---

// 1. Metadata Interface
export interface TestMetadata {
  year: number | string;
  day: string;
  month: string;
  date: string;
  shift: string;
  mode: string;
  exam: string;
}

// 2. Saved Session Interface
export interface SavedSessionData {
  testId: string;
  questionsById: Record<string, QuestionState>;
  
  // NEW: Save section times
  sectionTimeSpent: Record<string, number>; 
  
  timeLeftSeconds: number;
  activeQuestionId: string | null;
  activeSectionId: string | null;
  timestamp: number;
}

// 3. Combined Definition Type
export type TestDefinitionWithMetadata = TestDefinition & Partial<TestMetadata>;

interface TestEngineState {
  // --- STATE ---
  isInitialized: boolean;
  testId: string | null;
  title: string;
  metadata: TestMetadata | null;
  sections: TestSection[];
  
  timeLeftSeconds: number;
  
  // NEW: Track time spent per section (SectionID -> Seconds)
  sectionTimeSpent: Record<string, number>;

  activeSectionId: string | null;
  activeQuestionId: string | null;
  questionsById: Record<string, QuestionState>;

  // --- ACTIONS ---
  initFromDefinition: (def: TestDefinitionWithMetadata) => void;
  restoreSession: (savedData: SavedSessionData, def: TestDefinitionWithMetadata) => void; 
  syncWithServer: () => Promise<void>;
  
  setActiveSectionId: (sectionId: string) => void;
  jumpToQuestion: (questionId: string) => void;
  selectOption: (questionId: string, value: string) => void;
  
  saveAndNext: () => void;
  markForReview: () => void;
  clearResponse: () => void;
  
  tickTimer: () => void;
  submitTest: () => void;
}

// --- HELPER: Save to LocalStorage ---
const saveToLocal = (state: TestEngineState) => {
  if (!state.testId) return;
  
  const payload: SavedSessionData = {
    testId: state.testId,
    questionsById: state.questionsById,
    sectionTimeSpent: state.sectionTimeSpent, // Save section times
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

// --- STORE IMPLEMENTATION ---
export const useTestEngineStore = create<TestEngineState>()(
  devtools((set, get) => ({
    // Initial State
    isInitialized: false,
    testId: null,
    title: "",
    metadata: null,
    sections: [],
    timeLeftSeconds: 0,
    sectionTimeSpent: {}, // Init empty
    activeSectionId: null,
    activeQuestionId: null,
    questionsById: {},

    // --- 1. SETUP ---
    initFromDefinition: (def) => {
      const initialQuestionsState: Record<string, QuestionState> = {};
      const initialSectionTimes: Record<string, number> = {};
      
      def.sections.forEach((sec) => {
        // Initialize Section Timer
        initialSectionTimes[sec.id] = 0;

        sec.questions.forEach((q) => {
          initialQuestionsState[q.id] = {
            questionId: q.id,
            globalQuestionNumber: q.globalQuestionNumber,
            status: "notVisited",
            selectedOptionIds: [],
            numericAnswer: null,
            isVisited: false,
            // Initialize Question Timer
            // Note: Ensure your QuestionState interface has this field
            timeSpentSeconds: 0, 
          } as QuestionState; 
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
        metadata: {
          year: def.year || "2025",
          day: def.day || "",
          month: def.month || "",
          date: def.date || "",
          shift: def.shift || "",
          mode: def.mode || "online",
          exam: def.exam || "JEE_MAIN",
        },
        sections: def.sections,
        timeLeftSeconds: def.durationSeconds,
        sectionTimeSpent: initialSectionTimes,
        activeSectionId: firstSection?.id || null,
        activeQuestionId: firstQuestion?.id || null,
        questionsById: initialQuestionsState,
      };

      set(newState);
    },

    // --- 2. RESTORE SESSION ---
    restoreSession: (savedData, def) => {
      const restoredMetadata: TestMetadata = {
         year: def.year || "2025",
         day: def.day || "",
         month: def.month || "",
         date: def.date || "",
         shift: def.shift || "",
         mode: def.mode || "online",
         exam: def.exam || "JEE_MAIN",
      };

      set({
        isInitialized: true,
        testId: def.id,
        title: def.title,
        metadata: restoredMetadata, 
        sections: def.sections,
        
        // Restore Dynamic Data
        timeLeftSeconds: savedData.timeLeftSeconds,
        sectionTimeSpent: savedData.sectionTimeSpent || {}, // Restore section times
        activeSectionId: savedData.activeSectionId,
        activeQuestionId: savedData.activeQuestionId,
        questionsById: savedData.questionsById,
      });
      
      console.log("Session Restored from LocalStorage");
    },

    // --- 3. NAVIGATION ---
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

    // --- 4. INTERACTION ---
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

        saveToLocal({ ...state, ...nextState });
        return nextState;
      });
    },

    // --- 5. BUTTON LOGIC ---
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
        const newStatus: QuestionStatus = "notAnswered";

        const nextState = {
          questionsById: {
            ...state.questionsById,
            [activeQuestionId]: {
              ...state.questionsById[activeQuestionId],
              selectedOptionIds: [],
              numericAnswer: null,
              status: newStatus,
            },
          },
        };
        
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });
    },

    // --- 6. SYSTEM (UPDATED TIMER) ---
    tickTimer: () => {
      const { timeLeftSeconds, submitTest, activeSectionId, activeQuestionId, sectionTimeSpent, questionsById } = get();
      
      if (timeLeftSeconds <= 0) {
        submitTest();
        return;
      }

      // 1. Decrement Global Time
      const newTimeLeft = timeLeftSeconds - 1;

      // 2. Increment Section Time (if active)
      const newSectionTimes = { ...sectionTimeSpent };
      if (activeSectionId) {
        newSectionTimes[activeSectionId] = (newSectionTimes[activeSectionId] || 0) + 1;
      }

      // 3. Increment Question Time (if active)
      const newQuestionsById = { ...questionsById };
      if (activeQuestionId && newQuestionsById[activeQuestionId]) {
        // Safe check for 'timeSpentSeconds' property existence
        const currentSpent = newQuestionsById[activeQuestionId].timeSpentSeconds || 0;
        
        newQuestionsById[activeQuestionId] = {
          ...newQuestionsById[activeQuestionId],
          timeSpentSeconds: currentSpent + 1
        };
      }

      set({ 
        timeLeftSeconds: newTimeLeft,
        sectionTimeSpent: newSectionTimes,
        questionsById: newQuestionsById
      });
    },

    syncWithServer: async () => {
      const { testId, questionsById, sectionTimeSpent, timeLeftSeconds, activeQuestionId, activeSectionId } = get();
      if (!testId) return;

      const payload: SavedSessionData = {
        testId,
        timeLeftSeconds,
        activeQuestionId,
        activeSectionId,
        questionsById,
        sectionTimeSpent, // Included in sync
        timestamp: Date.now(),
      };

      try {
        await fetch("/api/tests/save-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("Auto-saved to server");
        console.log("savedData: ", payload);
      } catch (err) {
        console.warn("Server sync failed (offline?), data remains safe in LocalStorage");
      }
    },

    submitTest: () => {
      const { testId } = get();
      if (testId) {
        localStorage.removeItem(`test_progress_${testId}`);
      }
      
      console.log("Test Submitted!");
      // You can add navigation logic here or trigger a modal
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

      saveToLocal({ ...state, ...nextState });

      return nextState;
    });
  } else {
    console.log("End of questions reached");
  }
}