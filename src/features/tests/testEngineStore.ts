// src/features/tests/testEngineStore.ts
import { create, StoreApi, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  TestSection, 
  TestQuestion, 
  TestOption, 
  SessionDataResponse, 
  BackendQuestion, 
  BackendOptionsObject 
} from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";
import { updateTestSession } from "./api"; 

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
  // --- STATE ---
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

  // --- ACTIONS ---
  initFromBackendSession: (apiData: SessionDataResponse) => void;
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

// --- HELPER: Save to LocalStorage ---
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
    console.warn("Failed to save progress to local storage", e);
  }
};

// --- HELPER: Map Backend Status to Frontend Status ---
const mapBackendStatusToFrontend = (
  apiStatus: string | undefined, 
  isVisited: boolean, 
  markedForReview: boolean
): QuestionStatus => {
  if (apiStatus === "ATTEMPTED" || apiStatus === "ANSWERED") {
    return markedForReview ? "answeredAndMarked" : "answered";
  }
  if (markedForReview) return "markedForReview";
  if ((apiStatus === "NOT_ANSWERED" || apiStatus === "NOT_VISITED") && isVisited) {
    return "notAnswered";
  }
  return "notVisited";
};

// --- HELPER: Reconstruct Sections ---
function mapQuestionsToSections(backendQuestions: BackendQuestion[]): { sections: TestSection[], qMap: Record<string, QuestionState> } {
  const subjects = new Set<string>();
  backendQuestions.forEach(q => {
    if (q.subject) subjects.add(q.subject);
  });

  const sections: TestSection[] = [];
  const qMap: Record<string, QuestionState> = {};
  let globalCounter = 0;

  Array.from(subjects).forEach(subject => {
    const subjectQs = backendQuestions.filter((q) => q.subject === subject);
    
    // Split into MCQ (Section A) and Numerical (Section B)
    const mcqs = subjectQs.filter((q) => q.type !== 'Integer' && q.type !== 'Numerical');
    const nums = subjectQs.filter((q) => q.type === 'Integer' || q.type === 'Numerical');

    // Helper to process a sub-batch
    const processBatch = (qs: BackendQuestion[], labelSuffix: string) => {
      if (qs.length === 0) return;
      
      const sectionId = `sec-${sections.length}`;
      const mappedQuestions: TestQuestion[] = qs.map((q, idx) => {
        globalCounter++;
        
        const isInteger = q.type === 'Integer' || q.type === 'Numerical';
        const imgArray = Array.isArray(q.image) ? q.image : (q.image ? [q.image] : []);
        
        const optionsList: TestOption[] = [];
        if (!isInteger && q.options) {
           ['A', 'B', 'C', 'D'].forEach(lbl => {
             const tKey = `option${lbl}text` as keyof BackendOptionsObject;
             const iKey = `option${lbl}image` as keyof BackendOptionsObject;
             
             const textVal = q.options[tKey];
             const imgVal = q.options[iKey];

             optionsList.push({
               id: lbl,
               label: lbl,
               text: typeof textVal === 'string' ? textVal : '',
               imageUrl: (Array.isArray(imgVal) && imgVal.length > 0) ? imgVal[0] : null
             });
           });
        }

        const att = q.attemptStatus || { 
            userAnswer: null, 
            isVisited: false, 
            markedForReview: false, 
            timeSpent: 0, 
            status: "NOT_VISITED" 
        };
        
        let selectedIds: string[] = [];
        let numAns: string | null = null;

        if (isInteger) {
          if (att.userAnswer) numAns = String(att.userAnswer);
        } else {
          if (att.userAnswer) {
             selectedIds = Array.isArray(att.userAnswer) ? att.userAnswer : [att.userAnswer as string];
          }
        }

        const qStatus = mapBackendStatusToFrontend(att.status, att.isVisited, att.markedForReview);

        qMap[q.id] = {
          questionId: q.id,
          globalQuestionNumber: globalCounter,
          status: qStatus,
          isVisited: att.isVisited || false,
          timeSpentSeconds: att.timeSpent || 0,
          isBookmarked: false,
          selectedOptionIds: selectedIds,
          numericAnswer: numAns
        };

        return {
          id: q.id,
          index: idx + 1,
          globalQuestionNumber: globalCounter,
          kind: isInteger ? 'numerical' : 'single',
          contentText: q.content || "",
          images: imgArray,
          contentImageUrl: imgArray[0] || null,
          options: optionsList,
          correctMarks: q.positiveMarks || 4,
          negativeMarks: q.negativeMarks || 0,
          sectionId: sectionId
        };
      });

      sections.push({
        id: sectionId,
        label: `${subject} ${labelSuffix}`,
        subject: subject,
        questions: mappedQuestions
      });
    };

    processBatch(mcqs, "(Section A)");
    processBatch(nums, "(Section B)");
  });

  return { sections, qMap };
}

// --- NEXT QUESTION HELPER (Strictly Typed) ---
function moveToNextQuestion(
  get: StoreApi<TestEngineState>['getState'],
  set: StoreApi<TestEngineState>['setState']
) {
  const { sections, activeQuestionId, questionsById } = get();
  
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    const nextQ = allQuestions[currentIndex + 1];
    
    // We prepare the new state object first
    const newQs = { ...questionsById };
    
    if (newQs[nextQ.id].status === "notVisited") {
      newQs[nextQ.id] = {
        ...newQs[nextQ.id],
        status: "notAnswered",
        isVisited: true
      };
    }
    
    // Set state
    set({
      activeQuestionId: nextQ.id,
      activeSectionId: nextQ.sectionId,
      questionsById: newQs,
    });

    // Save to local using the FRESH state
    saveToLocal(get());
  } else {
    console.log("End of questions reached");
  }
}

// --- STORE DEFINITION ---
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

    initFromBackendSession: (apiData: SessionDataResponse) => {
      const { paper, questions, timeLeft, testId, activeQuestionId } = apiData;
      const { sections, qMap } = mapQuestionsToSections(questions);

      const initialQ = activeQuestionId || (sections[0]?.questions[0]?.id) || null;
      let initialSec = null;
      if (initialQ) {
        initialSec = sections.find(s => s.questions.some(q => q.id === initialQ))?.id || null;
      }

      set({
        isInitialized: true,
        testId: testId,
        paperId: paper.id, 
        title: `${paper.year} ${paper.shift || ''}`,
        timeLeftSeconds: timeLeft, 
        activeQuestionId: initialQ,
        activeSectionId: initialSec,
        questionsById: qMap,
        sections: sections,
        sectionTimeSpent: {}, 
      });
      
      saveToLocal(get());
    },

    syncWithServer: async () => {
      const state = get();
      if (!state.testId || !state.paperId) return;

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
        activeSection: "Chemistry", 
        activeQuestionId: state.activeQuestionId,
        state: "IN_PROGRESS" as const,
        timeStamp: new Date().toISOString(),
        questionStatus: questionStatusArray
      };

      try {
        console.log("Syncing to server...");
        await updateTestSession(payload);
        console.log("Sync successful");
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

    selectOption: (questionId, value) => {
      const { sections } = get();
      let isNumerical = false;
      for (const s of sections) {
        if (s.questions.some(q => q.id === questionId && q.kind === "numerical")) {
          isNumerical = true; break;
        }
      }

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

    toggleBookmark: (questionId) => {
      set((state) => {
        const currentQ = state.questionsById[questionId];
        if (!currentQ) return state; 

        const nextState = {
          questionsById: {
            ...state.questionsById,
            [questionId]: {
              ...currentQ,
              isBookmarked: !currentQ.isBookmarked
            }
          }
        };
        saveToLocal({ ...state, ...nextState });
        return nextState;
      });
    },

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

    tickTimer: () => {
      const { timeLeftSeconds, submitTest, activeSectionId, activeQuestionId, sectionTimeSpent, questionsById } = get();
      
      if (timeLeftSeconds <= 0) {
        submitTest();
        return;
      }

      const newTimeLeft = timeLeftSeconds - 1;
      const newSectionTimes = { ...sectionTimeSpent };
      if (activeSectionId) {
        newSectionTimes[activeSectionId] = (newSectionTimes[activeSectionId] || 0) + 1;
      }

      const newQuestionsById = { ...questionsById };
      if (activeQuestionId && newQuestionsById[activeQuestionId]) {
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

    submitTest: () => {
      const { testId } = get();
      get().syncWithServer();
      if (testId) {
        localStorage.removeItem(`test_progress_${testId}`);
      }
      console.log("Test Submitted!");
    },
  }),
  { name: "TestEngineStore" }
  )
);