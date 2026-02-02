import { create, StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  TestSection, 
  TestQuestion, 
  BackendQuestion, 
  BackendAttemptStatus,
  HierarchicalSessionData,
  UpdateTestStatusPayload // <--- Added Import
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
  createdAt: string | null; 
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
  
  createdAt: string | null;

  timerId: NodeJS.Timeout | null;

  // Actions
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
  
  startTimer: () => void;
  stopTimer: () => void;
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
    createdAt: state.createdAt,
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

  const preferredOrder = ["SingleCorrect", "MultiCorrect", "Comprehension", "Integer", "Numerical"];

  subjectKeys.forEach(subject => {
    const subjectData = data[subject] as Record<string, BackendQuestion[]>;
    if (!subjectData || typeof subjectData !== 'object') return;

    const availableTypes = Object.keys(subjectData).filter(key => 
      Array.isArray(subjectData[key]) && subjectData[key].length > 0
    );

    availableTypes.sort((a, b) => {
      const ixA = preferredOrder.indexOf(a);
      const ixB = preferredOrder.indexOf(b);
      return (ixA === -1 ? 99 : ixA) - (ixB === -1 ? 99 : ixB);
    });

    let sectionCharIndex = 0;

    availableTypes.forEach(typeKey => {
      const questionsList = subjectData[typeKey];
      questionsList.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));

      const sectionId = `sec-${sections.length}`;
      const sectionChar = String.fromCharCode(65 + sectionCharIndex);
      sectionCharIndex++;

      let typeReadable = typeKey;
      if (typeKey === "SingleCorrect") typeReadable = "MCQ";
      else if (typeKey === "MultiCorrect") typeReadable = "Multi Correct";
      else if (typeKey === "Integer" || typeKey === "Numerical") typeReadable = "Numerical";

      const mappedQuestions = questionsList.map((q, idx) => {
        globalCounter++;
        const tq = mapSingleQuestion(q, globalCounter, sectionId, idx + 1);
        
        const att: BackendAttemptStatus = q.attemptStatus || { 
            userAnswer: null, 
            isVisited: false, 
            markedForReview: false, 
            timeSpent: 0, 
            status: "NOT_VISITED" 
        };

        // Parse userAnswer from backend
        let selectedIds: string[] = [];
        let numAns: string | null = null;

        if (tq.kind === 'numerical') {
          if (Array.isArray(att.userAnswer) && att.userAnswer.length > 0) numAns = att.userAnswer[0];
          else if (typeof att.userAnswer === 'string') numAns = att.userAnswer;
        } else {
          if (att.userAnswer) {
             selectedIds = Array.isArray(att.userAnswer) 
               ? att.userAnswer 
               : [att.userAnswer as string];
          }
        }

        qMap[q.id] = {
          questionId: q.id,
          globalQuestionNumber: tq.globalQuestionNumber,
          status: mapBackendStatusToFrontend(att.status, att.isVisited, att.markedForReview),
          isVisited: att.isVisited || false,
          timeSpentSeconds: att.timeSpent || 0,
          isBookmarked: false,
          selectedOptionIds: selectedIds,
          numericAnswer: numAns
        };
        return tq;
      });

      sections.push({ 
        id: sectionId, 
        label: `${subject} - Section ${sectionChar} (${typeReadable})`, 
        subject: subject, 
        questions: mappedQuestions 
      });
    });
  });
  return { sections, qMap };
}

// --- HELPER: NEXT LOGIC ---
function moveToNextQuestion(get: StoreApi<TestEngineState>['getState'], set: StoreApi<TestEngineState>['setState']) {
  const { sections, activeQuestionId } = get();
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    const nextQ = allQuestions[currentIndex + 1];
    set((state) => {
      const newQs = { ...state.questionsById };
      if (newQs[nextQ.id].status === "notVisited") {
        newQs[nextQ.id] = { ...newQs[nextQ.id], status: "notAnswered", isVisited: true };
      }
      const nextState = { activeQuestionId: nextQ.id, activeSectionId: nextQ.sectionId, questionsById: newQs };
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
    createdAt: null, 
    timerId: null,

    initFromBackendSession: (data: HierarchicalSessionData) => {
      const { session, paper } = data; 
      const { sections, qMap } = parseHierarchicalData(data);

      let initialQ = session.activeQuestionId;
      if (!initialQ || !qMap[initialQ]) initialQ = sections[0]?.questions[0]?.id || null;
      
      let initialSec = null;
      if (initialQ) initialSec = sections.find(s => s.questions.some(q => q.id === initialQ))?.id || null;

      const newState = {
        isInitialized: true,
        testId: session.testId,
        paperId: paper.id, 
        title: `JEE ${paper.exam?.name || 'Test'} ${paper.year}`,
        timeLeftSeconds: session.timeLeft, 
        activeQuestionId: initialQ,
        activeSectionId: initialSec,
        questionsById: qMap,
        sections: sections,
        sectionTimeSpent: {},
        createdAt: session.startTime || new Date().toISOString(),
      };

      set(newState);
      saveToLocal({ ...get(), ...newState } as TestEngineState);
    },

    syncWithServer: async () => {
      const state = get();
      if (!state.testId || !state.paperId) return;

      const activeSecObj = state.sections.find(s => s.id === state.activeSectionId);
      const activeSubject = activeSecObj ? activeSecObj.subject : "General";

      // FIX: Use explicit type to avoid "unexpected any"
      const transformedQuestions: UpdateTestStatusPayload['questionsById'] = {};

      Object.values(state.questionsById).forEach((q) => {
        let finalAnswer: string[] = [];

        if (q.numericAnswer) {
          finalAnswer = [q.numericAnswer];
        } else if (q.selectedOptionIds && q.selectedOptionIds.length > 0) {
          finalAnswer = q.selectedOptionIds;
        }

        const isMarked = q.status === "markedForReview" || q.status === "answeredAndMarked";

        transformedQuestions[q.questionId] = {
          questionId: q.questionId,
          userAnswer: finalAnswer, 
          markedForReview: isMarked,
          isVisited: q.isVisited,
          timeSpent: q.timeSpentSeconds,
          status: q.status
        };
      });

      const payload: UpdateTestStatusPayload = {
        testId: state.testId,
        paperId: state.paperId,
        timeLeft: state.timeLeftSeconds,
        activeSection: activeSubject, 
        activeQuestionId: state.activeQuestionId,
        state: "IN_PROGRESS",
        timeStamp: new Date().toISOString(),
        created_at: state.createdAt,
        questionsById: transformedQuestions
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
          const current = newState.selectedOptionIds;
          newState.selectedOptionIds = current.includes(value) 
            ? current.filter(id => id !== value) 
            : [...current, value];
        } else {
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

    startTimer: () => {
      if (get().timerId) return;
      console.log("Timer started.");
      const id = setInterval(() => { get().tickTimer(); }, 1000);
      set({ timerId: id });
    },

    stopTimer: () => {
      const { timerId } = get();
      if (timerId) {
        console.log("Timer stopped.");
        clearInterval(timerId);
        set({ timerId: null });
      }
    },

    tickTimer: () => {
      const { timeLeftSeconds, submitTest, activeSectionId, activeQuestionId, sectionTimeSpent, questionsById } = get();
      if (timeLeftSeconds <= 0) { 
        submitTest(); 
        get().stopTimer(); 
        return; 
      }
      
      const newTimeLeft = timeLeftSeconds - 1;
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
      get().stopTimer();
      if (testId) localStorage.removeItem(`test_progress_${testId}`);
      console.log("Test Submitted!");
    },
  }),
  { name: "TestEngineStore" }
  )
);