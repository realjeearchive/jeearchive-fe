// src/features/tests/testEngineStore.ts
import { create, StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  TestSection, 
  TestQuestion, 
  BackendQuestion, 
  BackendAttemptStatus,
  HierarchicalSessionData,
  UpdateTestStatusPayload
} from "./types";
import { QuestionState, QuestionStatus } from "./playertypes";
import { updateTestSession, submitTestSession, mapSingleQuestion } from "./api"; 

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
  formattedBannerText: string;
  sections: TestSection[];
  timeLeftSeconds: number;
  sectionTimeSpent: Record<string, number>;
  activeSectionId: string | null;
  activeQuestionId: string | null;
  questionsById: Record<string, QuestionState>;
  changedQuestionIds: Set<string>; 
  paperMetadata: {
    year: number;
    month?: string;
    date?: string;
    shift?: string;
    examName?: string;
  } | null;
  
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
  
  submitTest: () => Promise<void>;
  
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
  att: BackendAttemptStatus
): QuestionStatus => {
  const hasAnswer = att.userAnswer && att.userAnswer.length > 0;
  if (hasAnswer) {
    return att.markedForReview ? ("answeredAndMarked" as QuestionStatus) : ("answered" as QuestionStatus);
  }
  if (att.markedForReview) return "markedForReview" as QuestionStatus;
  if (att.isVisited) return "notAnswered" as QuestionStatus;
  return "notVisited" as QuestionStatus;
};

// [UPDATED] Helper to build consistent payload (Delta for sync, Full for submit)
const buildPayload = (state: TestEngineState, status: "IN_PROGRESS" | "COMPLETED"): UpdateTestStatusPayload | null => {
  if (!state.testId || !state.paperId) return null;

  const idsToSync = new Set<string>();

  if (status === "COMPLETED") {
    // 🚨 CRITICAL FIX: On submit, we MUST send every single question
    Object.keys(state.questionsById).forEach(id => idsToSync.add(id));
  } else {
    // On 2-minute auto-save, only send what has changed + the active question
    state.changedQuestionIds.forEach(id => idsToSync.add(id));
    if (state.activeQuestionId) idsToSync.add(state.activeQuestionId);
    
    // If nothing changed, skip the API call
    if (idsToSync.size === 0) return null;
  }

  const activeSecObj = state.sections.find(s => s.id === state.activeSectionId);
  const activeSubject = activeSecObj ? activeSecObj.subject : "General";

  const transformedQuestions: UpdateTestStatusPayload['questionsById'] = {};

  idsToSync.forEach((id) => {
    const q = state.questionsById[id];
    if (!q) return;

    transformedQuestions[q.questionId] = {
      questionId: q.questionId,
      userAnswer: q.numericAnswer ? [q.numericAnswer] : q.selectedOptionIds, 
      markedForReview: q.status === "markedForReview" || q.status === "answeredAndMarked",
      isVisited: q.isVisited,
      timeSpent: q.timeSpentSeconds,
      status: q.status
    };
  });

  return {
    testId: state.testId,
    paperId: state.paperId,
    timeLeft: state.timeLeftSeconds,
    activeSection: activeSubject, 
    activeQuestionId: state.activeQuestionId,
    state: status,
    timeStamp: new Date().toISOString(),
    created_at: state.createdAt,
    questionsById: transformedQuestions
  };
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

      const typeReadable = typeKey === "SingleCorrect" ? "MCQ" : (typeKey === "MultiCorrect" ? "Multi Correct" : "Numerical");

      let localCounter = 0; 

      const mappedQuestions = questionsList.map((q, idx) => {
        globalCounter++;
        localCounter++; 
        
        const tq = mapSingleQuestion(q, globalCounter, sectionId, idx + 1);
        tq.localQuestionNumber = localCounter; 

        const att: BackendAttemptStatus = q.attemptStatus || { 
            userAnswer: null, 
            isVisited: false, 
            markedForReview: false, 
            timeSpent: 0, 
            status: "NOT_VISITED" 
        };

        qMap[q.id] = {
          questionId: q.id,
          globalQuestionNumber: tq.globalQuestionNumber,
          localQuestionNumber: tq.localQuestionNumber, 
          status: mapBackendStatusToFrontend(att),
          isVisited: att.isVisited || false,
          timeSpentSeconds: att.timeSpent || 0,
          isBookmarked: false,
          selectedOptionIds: (tq.kind !== 'numerical' && att.userAnswer) ? att.userAnswer : [],
          numericAnswer: (tq.kind === 'numerical' && att.userAnswer) ? att.userAnswer[0] : null
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

function moveToNextQuestion(get: StoreApi<TestEngineState>['getState'], set: StoreApi<TestEngineState>['setState']) {
  const { sections, activeQuestionId } = get();
  const allQuestions = sections.flatMap((s) => s.questions);
  const currentIndex = allQuestions.findIndex((q) => q.id === activeQuestionId);

  if (currentIndex < allQuestions.length - 1) {
    const nextQ = allQuestions[currentIndex + 1];
    set((state): Partial<TestEngineState> => {
      const newQs = { ...state.questionsById };
      const newChanges = new Set(state.changedQuestionIds);
      
      if (newQs[nextQ.id].status === "notVisited") {
        newQs[nextQ.id] = { ...newQs[nextQ.id], status: "notAnswered" as QuestionStatus, isVisited: true };
        newChanges.add(nextQ.id); 
      }
      
      const nextState = { 
        activeQuestionId: nextQ.id, 
        activeSectionId: nextQ.sectionId, 
        questionsById: newQs,
        changedQuestionIds: newChanges 
      };
      saveToLocal({ ...state, ...nextState } as TestEngineState);
      return nextState;
    });
  }
}

export const useTestEngineStore = create<TestEngineState>()(
  devtools((set, get) => ({
    isInitialized: false,
    testId: null,
    paperId: null,
    title: "",
    formattedBannerText: "",
    sections: [],
    timeLeftSeconds: 0,
    sectionTimeSpent: {}, 
    activeSectionId: null,
    activeQuestionId: null,
    questionsById: {},
    changedQuestionIds: new Set(),
    paperMetadata: null,
    createdAt: null, 
    timerId: null,

    initFromBackendSession: (data: HierarchicalSessionData) => {
      const { session, paper } = data;
      const { sections, qMap } = parseHierarchicalData(data);

      const initialQ = session.activeQuestionId || (sections[0]?.questions[0]?.id || null);
      const initialSec = initialQ ? (sections.find(s => s.questions.some(q => q.id === initialQ))?.id || null) : null;

      if (initialQ && qMap[initialQ]?.status === "notVisited") {
          qMap[initialQ].status = "notAnswered" as QuestionStatus;
          qMap[initialQ].isVisited = true;
      }

      // 🔥 FIXED: Calculate the banner text exactly once here
      const cleanExamName = (paper.exam?.name || "JEE MAIN").replace(/_/g, " ");
      const bannerParts = [
        cleanExamName,
        paper.year,
        paper.date,
        paper.month,
        paper.shift ? `${paper.shift} SHIFT` : ""
      ].filter(Boolean);
      const formattedBannerText = `${bannerParts.join(" ").toUpperCase()} UPDATED AS PER LATEST NTA PATTERN`;

      const newState = {
        isInitialized: true,
        testId: session.testId,
        paperId: paper.id, 
        title: `JEE ${paper.exam?.name || 'Test'} ${paper.year}`,
        formattedBannerText, // 🔥 ADD THIS TO NEW STATE
        timeLeftSeconds: session.timeLeft,
        activeQuestionId: initialQ,
        activeSectionId: initialSec,
        questionsById: qMap,
        sections: sections,
        sectionTimeSpent: {},
        paperMetadata: {
          year: paper.year,
          month: paper.month,
          date: paper.date,
          shift: paper.shift,
          examName: paper.exam?.name || "JEE MAIN",
        },
        createdAt: session.startTime || new Date().toISOString(),
      };

      set(newState);
      saveToLocal({ ...get(), ...newState } as TestEngineState);
    },

    syncWithServer: async () => {
      const state = get();
      const payload = buildPayload(state, "IN_PROGRESS");
      
      if (!payload) return;

      try {
        console.info(`[TestEngine] Auto-syncing ${Object.keys(payload.questionsById).length} changed questions...`);
        await updateTestSession(payload);
        set({ changedQuestionIds: new Set() });
      } catch (err) {
        console.error("[TestEngine] Auto-sync failed:", err);
      }
    },

    setActiveSectionId: (sectionId) => {
      const { sections } = get();
      const targetSection = sections.find((s) => s.id === sectionId);
      if (!targetSection || !targetSection.questions.length) return;
      get().jumpToQuestion(targetSection.questions[0].id);
    },

    jumpToQuestion: (questionId) => {
      set((state): Partial<TestEngineState> => {
        const newQs = { ...state.questionsById };
        const newChanges = new Set(state.changedQuestionIds);
        
        if (newQs[questionId].status === "notVisited") {
          newQs[questionId].status = "notAnswered" as QuestionStatus;
          newQs[questionId].isVisited = true;
          newChanges.add(questionId);
        }

        const section = state.sections.find((s) => s.questions.some((q) => q.id === questionId));
        const nextState = { 
          activeQuestionId: questionId, 
          activeSectionId: section?.id || state.activeSectionId, 
          questionsById: newQs,
          changedQuestionIds: newChanges
        };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    selectOption: (questionId, value) => {
      set((state): Partial<TestEngineState> => {
        const prev = state.questionsById[questionId];
        const qDef = state.sections.flatMap(s => s.questions).find(q => q.id === questionId);
        
        let newIds = [...prev.selectedOptionIds];
        let newNum = prev.numericAnswer;

        if (qDef?.kind === "numerical") newNum = value;
        else if (qDef?.kind === "multi") newIds = newIds.includes(value) ? newIds.filter(id => id !== value) : [...newIds, value];
        else newIds = [value];

        const nextState = { 
          questionsById: { ...state.questionsById, [questionId]: { ...prev, selectedOptionIds: newIds, numericAnswer: newNum } },
          changedQuestionIds: new Set(state.changedQuestionIds).add(questionId)
        };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    toggleBookmark: (questionId) => {
      set((state): Partial<TestEngineState> => {
        const currentQ = state.questionsById[questionId];
        if (!currentQ) return {}; 
        const nextState = { 
          questionsById: { ...state.questionsById, [questionId]: { ...currentQ, isBookmarked: !currentQ.isBookmarked } },
          changedQuestionIds: new Set(state.changedQuestionIds).add(questionId)
        };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    saveAndNext: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;
      const q = questionsById[activeQuestionId];
      const hasAns = q.selectedOptionIds.length > 0 || (q.numericAnswer !== null && q.numericAnswer !== "");
      
      set((state): Partial<TestEngineState> => ({
        questionsById: { 
            ...state.questionsById, 
            [activeQuestionId]: { ...q, status: (hasAns ? "answered" : "notAnswered") as QuestionStatus } 
        },
        changedQuestionIds: new Set(state.changedQuestionIds).add(activeQuestionId)
      }));
      moveToNextQuestion(get, set);
    },

    markForReview: () => {
      const { activeQuestionId, questionsById } = get();
      if (!activeQuestionId) return;
      const q = questionsById[activeQuestionId];
      const hasAns = q.selectedOptionIds.length > 0 || (q.numericAnswer !== null && q.numericAnswer !== "");
      
      const newStatus: QuestionStatus = hasAns ? ("answeredAndMarked" as QuestionStatus) : ("markedForReview" as QuestionStatus);

      set((state): Partial<TestEngineState> => {
        const nextState = { 
          questionsById: { 
            ...state.questionsById, 
            [activeQuestionId]: { ...state.questionsById[activeQuestionId], status: newStatus } 
          },
          changedQuestionIds: new Set(state.changedQuestionIds).add(activeQuestionId)
        };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
      moveToNextQuestion(get, set);
    },

    clearResponse: () => {
      const { activeQuestionId } = get();
      if (!activeQuestionId) return;
      
      set((state): Partial<TestEngineState> => {
        const nextState = { 
          questionsById: { 
            ...state.questionsById, 
            [activeQuestionId]: { 
              ...state.questionsById[activeQuestionId], 
              selectedOptionIds: [], 
              numericAnswer: null, 
              status: "notAnswered" as QuestionStatus 
            } 
          },
          changedQuestionIds: new Set(state.changedQuestionIds).add(activeQuestionId)
        };
        saveToLocal({ ...state, ...nextState } as TestEngineState);
        return nextState;
      });
    },

    startTimer: () => {
      if (get().timerId) return;
      const id = setInterval(() => { get().tickTimer(); }, 1000);
      set({ timerId: id });
    },

    stopTimer: () => {
      const { timerId } = get();
      if (timerId) {
        clearInterval(timerId);
        set({ timerId: null });
      }
    },

    tickTimer: () => {
      const { timeLeftSeconds, submitTest, activeSectionId, activeQuestionId, sectionTimeSpent, questionsById, changedQuestionIds } = get();
      if (timeLeftSeconds <= 0) { 
        submitTest(); 
        return; 
      }
      
      const newTimeLeft = timeLeftSeconds - 1;
      if (newTimeLeft % 120 === 0 && newTimeLeft !== 0) get().syncWithServer();

      const newSectionTimes = { ...sectionTimeSpent };
      if (activeSectionId) newSectionTimes[activeSectionId] = (newSectionTimes[activeSectionId] || 0) + 1;

      const newQuestionsById = { ...questionsById };
      const newChanges = new Set(changedQuestionIds);

      if (activeQuestionId && newQuestionsById[activeQuestionId]) {
        newQuestionsById[activeQuestionId].timeSpentSeconds += 1;
        newChanges.add(activeQuestionId);
      }

      set({ timeLeftSeconds: newTimeLeft, sectionTimeSpent: newSectionTimes, questionsById: newQuestionsById, changedQuestionIds: newChanges });
    },

    submitTest: async () => {
      const state = get();
      const payload = buildPayload(state, "COMPLETED");

      get().stopTimer();
      
      if (payload) {
        try {
            console.info(`[TestEngine] Submitting final test payload for Session: ${payload.testId}`);
            await submitTestSession(payload);
            console.info("[TestEngine] Test Submitted Successfully!");
            
            // Clean up local storage
            if (state.testId) {
                localStorage.removeItem(`test_progress_${state.testId}`);
            }
            
            // Reset changed IDs so we don't try to sync again if something persists
            set({ changedQuestionIds: new Set() });
        } catch (err) {
            console.error("[TestEngine] Final Submission failed:", err);
            // Re-throw so the UI (TestSubmissionSummary) can catch it and show a toast
            throw err; 
        }
      }
    },
  }),
  { name: "TestEngineStore" }),
);