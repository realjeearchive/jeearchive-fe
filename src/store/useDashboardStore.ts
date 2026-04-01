"use client";

import { create } from "zustand";

// --- STRICT TYPESCRIPT INTERFACES ---

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

export interface DashboardQuestionWiseStat {
  questionType: string;
  marks: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

export interface DashboardTestAttempt {
  testId: string;
  createdAt: string;
  source: string;
  paperDetails?: {
    exam?: { name: string };
    year?: number;
    month?: string;
    shift?: string;
    totalMarks?: number;
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
    // Allow fallback for unexpected subject keys
    [key: string]: DashboardSubjectStat | undefined; 
  };
  questionWise?: DashboardQuestionWiseStat[];
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
  avgTimeTaken: number;
  subjects: AggregateSubjectStat[];
  questionWise: AggregateQuestionWiseStat[];
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

export interface ExamStat {
  examName: string;
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface SubjectQuestions {
  uniqueAttempted: number;
  totalQuestions: number;
}

// 4. THE MAIN PAYLOAD FROM API
export interface DashboardDataPayload {
  studentId: string;
  generatedAt: string;
  
  tests?: {
    last5: DashboardTestAttempt[];
    last5Aggregate?: Last5Aggregate; // Strictly typed now!
  };
  
  practice?: {
    studentId?: string;
    generatedAt?: string;
    overall?: PracticeOverall;
    subjects?: SubjectPractice[];
    questionTypes?: QuestionTypeStat[];
    exams?: ExamStat[];
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
    
    // 1. Check for Mock Tests in the new nested structure
    const testCount = report.tests?.last5?.length || 0;
    
    // 2. Check for overall practice attempts
    const practiceAttempts = report.practice?.overall?.totalAttempts || 0;
    
    // 3. Check for ANY uniquely solved questions across subjects
    const uniqueMath = report.uniqueQuestionsAttempted?.subjectWise?.Mathematics?.uniqueAttempted || 0;
    const uniquePhy = report.uniqueQuestionsAttempted?.subjectWise?.Physics?.uniqueAttempted || 0;
    const uniqueChem = report.uniqueQuestionsAttempted?.subjectWise?.Chemistry?.uniqueAttempted || 0;
    
    // Add them up
    const totalUnique = report.uniqueQuestionsAttempted?.total || (uniqueMath + uniquePhy + uniqueChem);

    // If they have 0 tests AND 0 practice attempts AND 0 unique questions solved, they are new.
    return testCount === 0 && practiceAttempts === 0 && totalUnique === 0;
  }
}));