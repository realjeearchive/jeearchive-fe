import { create, StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  TestSection, 
  TestQuestion, 
  SessionDataResponse, 
  BackendQuestion, 
  BackendAttemptStatus,
  HierarchicalSessionData 
} from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";
import { updateTestSession, mapSingleQuestion } from "./api"; 

// --- TYPES ---
export interface SavedSessionData {
  testId: string;
  questionsById: Record<string, QuestionState>;
  sectionTimeSpent: Record<string, number>; 
  timeLeftSeconds: number;
  activeQuestionId: string | null;
  activeSectionId: string | null;
  timestamp: number;
}

interface TestEngineState {
  isInitialized: boolean;
  testId: string | null;
  paperId: string | null; 
  title: string;
  sections: TestSection[];
  timeLeftSeconds: number;
  sectionTimeSpent: Record<string, number>;
  activeSectionId: string | null;
  activeQuestionId: string | null;
  questionsById: Record<string, QuestionState>;

  // ACTION: Expects the unwrapped data object
  initFromBackendSession: (data: HierarchicalSessionData) => void;
  syncWithServer: () => Promise<void>;
  
  setActiveSectionId: (sectionId: string) => void;
  jumpToQuestion: (questionId: string) => void;
  selectOption: (questionId: string, value: string) => void;
  toggleBookmark: (questionId: string) => void;
  
  saveAndNext: () => void;
  markForReview: () => void;
  clearResponse: () => void;
  tickTimer: () => void;
  submitTest: () => void;
}

// --- HELPERS ---
const saveToLocal = (state: TestEngineState) => {
  if (!state.testId) return;
  const payload: SavedSessionData = {
    testId: state.testId,
    questionsById: state.questionsById,
    sectionTimeSpent: state.sectionTimeSpent, 
    timeLeftSeconds: state.timeLeftSeconds,
    activeQuestionId: state.activeQuestionId,
    activeSectionId: state.activeSectionId,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(`test_progress_${state.testId}`, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to save progress", e);
  }
};

const mapBackendStatusToFrontend = (
  apiStatus: string | undefined, 
  isVisited: boolean, 
  markedForReview: boolean
): QuestionStatus => {
  if (apiStatus === "ATTEMPTED" || apiStatus === "ANSWERED") return markedForReview ? "answeredAndMarked" : "answered";
  if (apiStatus === "REVIEW" || markedForReview) return "markedForReview";
  if ((apiStatus === "NOT_ANSWERED" || apiStatus === "NOT_VISITED") && isVisited) return "notAnswered";
  return "notVisited";
};

// --- HIERARCHICAL PARSER ---
function parseHierarchicalData(data: HierarchicalSessionData): { sections: TestSection[], qMap: Record<string, QuestionState> } {
  const sections: TestSection[] = [];
  const qMap: Record<string, QuestionState> = {};
  let globalCounter = 0;

  const ignoreKeys = ['session', 'paper', 'success', 'message'];
  const subjectKeys = Object.keys(data).filter(k => !ignoreKeys.includes(k));

  subjectKeys.forEach(subject => {
    // Safe cast because we know the structure: { "SingleCorrect": [...], "Integer": [...] }
    const subjectData = data[subject] as Record<string, BackendQuestion[]>;
    
    // Check if subjectData is actually an object and not null/undefined
    if (!subjectData || typeof subjectData !== 'object') return;

    Object.keys(subjectData).forEach(typeKey => {
      const questionsList = subjectData[typeKey];
      if (!Array.isArray(questionsList) || questionsList.length === 0) return;

      const sectionId = `sec-${sections.length}`;
      let typeLabel = typeKey;
      // Map backend types to readable labels
      if (typeKey === "SingleCorrect") typeLabel = "Section A (MCQ)";
      else if (typeKey === "Integer") typeLabel = "Section B (Numerical)";
      else if (typeKey === "MultiCorrect") typeLabel = "Section C (Multi Correct)";
      else if (typeKey === "Comprehension") typeLabel = "Section D (Comprehension)";

      const mappedQuestions = questionsList.map((q, idx) => {
        globalCounter++;
        // Use the shared mapper from API to ensure consistency
        const tq = mapSingleQuestion(q, globalCounter, sectionId, idx + 1);
        
        // Handle potentially missing attemptStatus
        const att: BackendAttemptStatus = q.attemptStatus || { 
            userAnswer: null, 
            isVisited: false, 
            markedForReview: false, 
            timeSpent: 0, 
            status: "NOT_VISITED" 
        };

        let selectedIds: string[] = [];
        let numAns: string | null = null;

        if (tq.kind === 'numerical') {
          if (att.userAnswer) numAns = String(att.userAnswer);
        } else {
          // MCQs can be single string or array of strings
          if (att.userAnswer) {
             selectedIds = Array.isArray(att.userAnswer) 
               ? att.userAnswer 
               : [att.userAnswer as string];
          }
        }

        qMap[q.id] = {
          questionId: q.id,
          globalQuestionNumber: globalCounter,
          status: mapBackendStatusToFrontend(att.status, att.isVisited, att.markedForReview),
          isVisited: att.isVisited || false,
          timeSpentSeconds: att.timeSpent || 0,
          isBookmarked: false, // Bookmark is local-only usually
          selectedOptionIds: selectedIds,
          numericAnswer: numAns
        };
        return tq;
      });

      sections.push({ 
        id: sectionId, 
        label: `${subject} - ${typeLabel}`, 
        subject: subject, 
        questions: mappedQuestions 
      });
    });
  });
  return { sections, qMap };
}

// --- HELPER: NEXT LOGIC ---
function moveToNextQuestion(get: StoreApi<TestEngineState>['getState'], set: StoreApi<TestEngineState>['setState']) {
  const { sections, activeQuestionId, questionsById } = get();
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    const nextQ = allQuestions[currentIndex + 1];
    set((state) => {
      const newQs = { ...state.questionsById };
      // Auto-visit logic: if moving to a new question, mark it as visited
      if (newQs[nextQ.id].status === "notVisited") {
        newQs[nextQ.id] = { ...newQs[nextQ.id], status: "notAnswered", isVisited: true };
      }
      const nextState = { activeQuestionId: nextQ.id, activeSectionId: nextQ.sectionId, questionsById: newQs };
      // Explicit cast to keep TS happy with partial updates
      saveToLocal({ ...state, ...nextState } as TestEngineState);
      return nextState;
    });
  }
}

// --- STORE IMPLEMENTATION ---
export const useTestEngineStore = create<TestEngineState>()(
  devtools((set, get) => ({
    isInitialized: false,
    testId: null,
    paperId: null,
    title: "",
    sections: [],
    timeLeftSeconds: 0,
    sectionTimeSpent: {}, 
    activeSectionId: null,
    activeQuestionId: null,
    questionsById: {},

    // FIX: Using data directly (removed apiData.data access that caused the crash)
    initFromBackendSession: (data: HierarchicalSessionData) => {
      const { session, paper } = data; 
      const { sections, qMap } = parseHierarchicalData(data);

      // Restore active question, or default to first
      let initialQ = session.activeQuestionId;
      if (!initialQ || !qMap[initialQ]) initialQ = sections[0]?.questions[0]?.id || null;
      
      let initialSec = null;
      if (initialQ) initialSec = sections.find(s => s.questions.some(q => q.id === initialQ))?.id || null;

      const newState = {
        isInitialized: true,
        testId: session.testId,
        paperId: paper.id, 
        // Fallback for title if exam name is missing
        title: `JEE ${paper.exam?.name || 'Test'} ${paper.year}`,
        timeLeftSeconds: session.timeLeft, 
        activeQuestionId: initialQ,
        activeSectionId: initialSec,
        questionsById: qMap,
        sections: sections,
        sectionTimeSpent: {}, 
      };

      set(newState);
      saveToLocal({ ...get(), ...newState } as TestEngineState);
    },

    syncWithServer: async () => {
      const state = get();
      if (!state.testId || !state.paperId) return;

      const activeSecObj = state.sections.find(s => s.id === state.activeSectionId);
      const activeSubject = activeSecObj ? activeSecObj.subject : "General";

      const questionStatusArray = Object.values(state.questionsById).map(q => {
        let backendStatus = "NOT_VISITED";
        if (q.status === "answered" || q.status === "answeredAndMarked") backendStatus = "ATTEMPTED";
        else if (q.status === "markedForReview") backendStatus = "REVIEW";
        else if (q.status === "notAnswered") backendStatus = "NOT_ANSWERED";
        
        let finalAns: string | null = null;
        if (q.numericAnswer) finalAns = q.numericAnswer;
        else if (q.selectedOptionIds.length > 0) finalAns = q.selectedOptionIds[0];

        return {
          questionId: q.questionId,
          userAnswer: finalAns,
          isVisited: q.isVisited,
          markedForReview: q.status === "markedForReview" || q.status === "answeredAndMarked",
          timeSpent: q.timeSpentSeconds,
          status: backendStatus
        };
      });

      const payload = {
        testId: state.testId,
        paperId: state.paperId,
        timeLeft: state.timeLeftSeconds,
        activeSection: activeSubject, 
        activeQuestionId: state.activeQuestionId,
        state: "IN_PROGRESS" as const,
        timeStamp: new Date().toISOString(),
        questionStatus: questionStatusArray
      };

      try {
        await updateTestSession(payload);
      } catch (err) {
        console.warn("Sync failed", err);
      }
    },

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
        const nextState = { activeSectionId: sectionId, activeQuestionId: qId, questionsById: newQs };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
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
        const section = state.sections.find((s) => s.questions.some((q) => q.id === questionId));
        const nextState = { activeQuestionId: questionId, activeSectionId: section?.id || state.activeSectionId, questionsById: newQs };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    selectOption: (questionId, value) => {
      const { sections } = get();
      let isNumerical = false;
      let isMulti = false;
      for (const s of sections) {
        const q = s.questions.find(fq => fq.id === questionId);
        if (q) {
          isNumerical = q.kind === "numerical";
          isMulti = q.kind === "multi";
          break;
        }
      }

      set((state) => {
        const prev = state.questionsById[questionId];
        const newState = { ...prev };
        
        if (isNumerical) {
          newState.numericAnswer = value; 
        } else if (isMulti) {
          // Toggle logic for Multi-Correct
          const current = newState.selectedOptionIds;
          newState.selectedOptionIds = current.includes(value) 
            ? current.filter(id => id !== value) 
            : [...current, value];
        } else {
          // Single Choice
          newState.selectedOptionIds = [value]; 
        }

        const nextState = { questionsById: { ...state.questionsById, [questionId]: newState } };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    toggleBookmark: (questionId) => {
      set((state) => {
        const currentQ = state.questionsById[questionId];
        if (!currentQ) return {}; 
        const nextState = { questionsById: { ...state.questionsById, [questionId]: { ...currentQ, isBookmarked: !currentQ.isBookmarked } } };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    saveAndNext: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;
      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = currentQ.selectedOptionIds.length > 0 || (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");
      
      const newStatus: QuestionStatus = hasAnswer ? "answered" : "notAnswered";

      set((state) => {
        const nextState = { questionsById: { ...state.questionsById, [activeQuestionId]: { ...state.questionsById[activeQuestionId], status: newStatus } } };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
      moveToNextQuestion(get, set);
    },

    markForReview: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;
      const currentQ = questionsById[activeQuestionId];
      const hasAnswer = currentQ.selectedOptionIds.length > 0 || (currentQ.numericAnswer !== null && currentQ.numericAnswer !== "");
      
      // If answered, status is 'answeredAndMarked', else 'markedForReview'
      const newStatus: QuestionStatus = hasAnswer ? "answeredAndMarked" : "markedForReview";

      set((state) => {
        const nextState = { questionsById: { ...state.questionsById, [activeQuestionId]: { ...state.questionsById[activeQuestionId], status: newStatus } } };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
      moveToNextQuestion(get, set);
    },

    clearResponse: () => {
      const { activeQuestionId } = get();
      if (!activeQuestionId) return;
      
      const newStatus: QuestionStatus = "notAnswered";

      set((state) => {
        const nextState = { questionsById: { ...state.questionsById, [activeQuestionId]: { ...state.questionsById[activeQuestionId], selectedOptionIds: [], numericAnswer: null, status: newStatus } } };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    tickTimer: () => {
      const { timeLeftSeconds, submitTest, activeSectionId, activeQuestionId, sectionTimeSpent, questionsById } = get();
      if (timeLeftSeconds <= 0) { submitTest(); return; }
      
      const newTimeLeft = timeLeftSeconds - 1;
      
      // Auto-sync every 3 minutes (180s)
      if (newTimeLeft % 180 === 0 && newTimeLeft !== 0) get().syncWithServer();

      const newSectionTimes = { ...sectionTimeSpent };
      if (activeSectionId) newSectionTimes[activeSectionId] = (newSectionTimes[activeSectionId] || 0) + 1;

      const newQuestionsById = { ...questionsById };
      if (activeQuestionId && newQuestionsById[activeQuestionId]) {
        const currentSpent = newQuestionsById[activeQuestionId].timeSpentSeconds || 0;
        newQuestionsById[activeQuestionId] = { ...newQuestionsById[activeQuestionId], timeSpentSeconds: currentSpent + 1 };
      }
      set({ timeLeftSeconds: newTimeLeft, sectionTimeSpent: newSectionTimes, questionsById: newQuestionsById });
    },

    submitTest: () => {
      const { testId } = get();
      get().syncWithServer();
      if (testId) localStorage.removeItem(`test_progress_${testId}`);
      console.log("Test Submitted!");
    },
  }),
  { name: "TestEngineStore" }
  )
);