// src/features/tests/testEngineStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TestDefinition, TestQuestion, TestSection } from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";

interface TestEngineState {
  // --- STATE ---
  isInitialized: boolean;
  testId: string | null;
  title: string;
  sections: TestSection[];
  
  // Timer
  timeLeftSeconds: number;
  
  // Navigation
  activeSectionId: string | null;
  activeQuestionId: string | null;
  
  // Question States (The "User's Answers")
  questionsById: Record<string, QuestionState>;

  // --- ACTIONS ---
  
  // 1. Setup
  initFromDefinition: (def: TestDefinition) => void;
  
  // 2. Navigation
  setActiveSection: (sectionId: string) => void;
  jumpToQuestion: (questionId: string) => void;
  
  // 3. User Interaction
  selectOption: (questionId: string, value: string) => void; // Value can be OptionID or Numeric Answer
  
  // 4. Control Panel Buttons (NTA Logic)
  saveAndNext: () => void;
  markForReview: () => void;
  clearResponse: () => void;
  
  // 5. System
  tickTimer: () => void;
  submitTest: () => void;
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
      // Create initial state for every question
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

      // Set first section and question as active
      const firstSection = def.sections[0];
      const firstQuestion = firstSection?.questions[0];

      // Mark first question as "Not Answered" (Red) immediately upon visit if not answered
      if (firstQuestion) {
        initialQuestionsState[firstQuestion.id].isVisited = true;
        initialQuestionsState[firstQuestion.id].status = "notAnswered";
      }

      set({
        isInitialized: true,
        testId: def.id,
        title: def.title,
        sections: def.sections,
        timeLeftSeconds: def.durationSeconds,
        activeSectionId: firstSection?.id || null,
        activeQuestionId: firstQuestion?.id || null,
        questionsById: initialQuestionsState,
      });
    },

    // --- 2. NAVIGATION ---
    setActiveSection: (sectionId) => {
      const { sections, questionsById } = get();
      const targetSection = sections.find((s) => s.id === sectionId);
      if (!targetSection || !targetSection.questions.length) return;

      // When switching sections, jump to the first question of that section
      const firstQ = targetSection.questions[0];
      const qId = firstQ.id;

      set((state) => {
        const newQs = { ...state.questionsById };
        // Mark new question as visited/notAnswered if it was 'notVisited'
        if (newQs[qId].status === "notVisited") {
          newQs[qId].status = "notAnswered";
          newQs[qId].isVisited = true;
        }
        return {
          activeSectionId: sectionId,
          activeQuestionId: qId,
          questionsById: newQs,
        };
      });
    },

    jumpToQuestion: (questionId) => {
      set((state) => {
        const newQs = { ...state.questionsById };
        
        // Mark target as visited
        if (newQs[questionId].status === "notVisited") {
          newQs[questionId].status = "notAnswered";
          newQs[questionId].isVisited = true;
        }

        // Find which section this question belongs to
        const section = state.sections.find((s) => 
          s.questions.some((q) => q.id === questionId)
        );

        return {
          activeQuestionId: questionId,
          activeSectionId: section?.id || state.activeSectionId,
          questionsById: newQs,
        };
      });
    },

    // --- 3. INTERACTION ---
    selectOption: (questionId, value) => {
      const { sections } = get();
      
      // Determine question type (Single vs Numerical)
      const section = sections.find(s => s.questions.some(q => q.id === questionId));
      const questionDef = section?.questions.find(q => q.id === questionId);
      const isNumerical = questionDef?.kind === "numerical";

      set((state) => {
        const prev = state.questionsById[questionId];
        const newState = { ...prev };

        if (isNumerical) {
          newState.numericAnswer = value; // value is the text typed
        } else {
          // Radio button behavior (replace existing selection)
          newState.selectedOptionIds = [value]; 
        }

        return {
          questionsById: {
            ...state.questionsById,
            [questionId]: newState,
          },
        };
      });
    },

    // --- 4. BUTTON LOGIC (NTA RULES) ---

    // HELPER: Move to next question automatically
    // We define this logic inside the actions to avoid code duplication
    
    saveAndNext: () => {
      const { activeQuestionId, questionsById, sections } = get();
      if (!activeQuestionId) return;

      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = 
        currentQ.selectedOptionIds.length > 0 || 
        (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");

      // 1. Update Status
      const newStatus: QuestionStatus = hasAnswer ? "answered" : "notAnswered";

      set((state) => ({
        questionsById: {
          ...state.questionsById,
          [activeQuestionId]: {
            ...state.questionsById[activeQuestionId],
            status: newStatus,
          },
        },
      }));

      // 2. Move Next
      moveToNextQuestion(get, set);
    },

    markForReview: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;

      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = 
        currentQ.selectedOptionIds.length > 0 || 
        (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");

      // NTA Logic:
      // If answered -> "Answered & Marked for Review" (Purple + Green) -> EVALUATED
      // If empty -> "Marked for Review" (Purple) -> NOT EVALUATED
      const newStatus: QuestionStatus = hasAnswer 
        ? "answeredAndMarked" 
        : "markedForReview";

      set((state) => ({
        questionsById: {
          ...state.questionsById,
          [activeQuestionId]: {
            ...state.questionsById[activeQuestionId],
            status: newStatus,
          },
        },
      }));

      moveToNextQuestion(get, set);
    },

    clearResponse: () => {
      const { activeQuestionId } = get();
      if (!activeQuestionId) return;

      set((state) => ({
        questionsById: {
          ...state.questionsById,
          [activeQuestionId]: {
            ...state.questionsById[activeQuestionId],
            selectedOptionIds: [],
            numericAnswer: null,
            status: "notAnswered", // Reset to Red (visited but empty)
          },
        },
      }));
    },

    // --- 5. SYSTEM ---
    tickTimer: () => {
      const { timeLeftSeconds, submitTest } = get();
      if (timeLeftSeconds <= 0) {
        submitTest();
        return;
      }
      set({ timeLeftSeconds: timeLeftSeconds - 1 });
    },

    submitTest: () => {
      // This will handle auto-submission
      console.log("Test Submitted!");
      // Here you would trigger a router push to /result or open a modal
      alert("Test Submitted Successfully!");
    },
  }),
  { name: "TestEngineStore" }
  )
);

// --- INTERNAL HELPER FOR "NEXT" LOGIC ---
// --- INTERNAL HELPER FOR "NEXT" LOGIC ---
function moveToNextQuestion(
  get: () => TestEngineState, 
  set: (fn: (state: TestEngineState) => Partial<TestEngineState>) => void
) {
  const { sections, activeQuestionId } = get();
  
  // Flatten all questions to find the index
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    // Go to next
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
      
      // Check if we changed sections (e.g., from Physics Q30 to Chemistry Q1)
      const nextSectionId = nextQ.sectionId;

      return {
        activeQuestionId: nextQ.id,
        activeSectionId: nextSectionId,
        questionsById: newQs,
      };
    });
  } else {
    // End of test - usually we just stay on the last question or show a message
    console.log("End of questions reached");
  }
}