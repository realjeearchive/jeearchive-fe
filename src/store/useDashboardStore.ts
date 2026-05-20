"use client";

import { create } from "zustand";

// --- STRICT TYPESCRIPT INTERFACES ---

// 1. Types for Individual Test Attempts
// 1. Types for Individual Test Attempts
export interface DashboardSubjectStat {
  subjectName: string;
  marks: number;
  correct: number;
  wrong: number;
  timeTaken: number;
  totalQuestions: number;
  accuracy: number;
}

export interface DashboardTestAttempt {
  testId: string;
  createdAt: string;
  source: string;
  paperDetails?: {
    exam?: { name: string };
    year?: number | string;
    month?: string;
    day?: string;           // <-- Added
    date?: string | number; // <-- Added
    shift?: string;
    mode?: string;          // <-- Added
    totalMarks?: number;
    totalDuration?: number; // <-- Added
    totalQuestions?: number;// <-- Added
  };
  overall: {
    marks: number;
    maxMarks: number;
    accuracy: number;
    timeTaken: number;
  };
  subjects?: {
    math?: DashboardSubjectStat;
    physics?: DashboardSubjectStat;
    chemistry?: DashboardSubjectStat;
    [key: string]: DashboardSubjectStat | undefined; 
  };
}

// 2. Types for the Aggregate Data
export interface AggregateSubjectStat {
  subjectName: string;
  totalMarks: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export interface AggregateQuestionWiseStat {
  questionType: string;
  totalMarks: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

export interface Last5Aggregate {
  testsIncluded: number;
  totalMarks: number;
  totalMaxMarks: number;
  overallAccuracy: number;
  overallPercentage: number;
  avgTimeTaken: number;
  subjects: AggregateSubjectStat[];
  questionWise: AggregateQuestionWiseStat[];
}

export interface TestCategoryData {
  last5: DashboardTestAttempt[];
  aggregate: Last5Aggregate;
}

// 3. Types for Practice & Unique Questions
export interface PracticeOverall {
  totalAttempts: number;
  totalTimeSpent: number;
  totalMarksEarned: number;
  totalMaxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface SubjectPractice {
  subjectId: string;
  subjectName?: string;
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface QuestionTypeStat {
  questionType: string; 
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface PracticeCategoryData {
  overall: PracticeOverall;
  subjects: SubjectPractice[];
  questionTypes: QuestionTypeStat[];
}

export interface SubjectQuestions {
  uniqueAttempted: number;
  totalQuestions: number;
}

// 4. THE MAIN PAYLOAD FROM API
export interface DashboardDataPayload {
  studentId: string;
  generatedAt: string;
  totalUniqueMockTests: number;
  
  tests?: {
    overall?: TestCategoryData;
    jeeMain?: TestCategoryData;
    jeeAdvanced?: TestCategoryData;
  };
  
  practice?: {
    overall?: PracticeCategoryData;
    jeeMain?: PracticeCategoryData;
    jeeAdvanced?: PracticeCategoryData;
  };
  
  uniqueQuestionsAttempted?: {
    total: number;
    subjectWise: {
      Mathematics?: SubjectQuestions;
      Physics?: SubjectQuestions;
      Chemistry?: SubjectQuestions;
    };
  };
}

// --- STORE DEFINITION ---
interface DashboardStore {
  rawReport: DashboardDataPayload | null; 
  isLoading: boolean;
  error: string | null;
  
  setDashboardData: (data: DashboardDataPayload) => void;
  setLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
  isNewUser: () => boolean;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  rawReport: null,
  isLoading: true,
  error: null,

  setDashboardData: (data) => set({ rawReport: data, isLoading: false, error: null }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg, isLoading: false }),

  isNewUser: () => {
    const report = get().rawReport;
    if (!report) return true;
    
    // The backend now provides a clean "totalUniqueMockTests" metric!
    const testCount = report.totalUniqueMockTests || 0;
    const practiceCount = report.uniqueQuestionsAttempted?.total || 0;
    
    return testCount === 0 && practiceCount === 0;
  }
}));