"use client";

import { create } from "zustand";

// --- STRICT TYPESCRIPT INTERFACES ---
export interface TestAttempt {
  testId: string;
  examName: string;
  source: string;
  createdAt: string;
  marks: number;
  maxMarks: number;
  accuracy: number;
  timeTaken: number;
  subjects: Record<string, number | null>; // Assuming subjects map to scores/times
}

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
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface QuestionTypeStat {
  type: string;
  accuracy: number;
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

// THE MAIN PAYLOAD FROM API
export interface DashboardDataPayload {
  studentId: string;
  generatedAt: string;
  last5Tests: TestAttempt[];
  practice: {
    studentId: string;
    generatedAt: string;
    overall: PracticeOverall;
    subjects: SubjectPractice[];
    questionTypes: QuestionTypeStat[];
    exams: ExamStat[];
  };
  uniqueQuestionsAttempted: {
    total: number;
    subjectWise: {
      Mathematics: SubjectQuestions;
      Physics: SubjectQuestions;
      Chemistry: SubjectQuestions;
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
    
    const totalAttempts = report.practice?.overall?.totalAttempts ?? 0;
    const testCount = report.last5Tests?.length ?? 0;
    
    return totalAttempts === 0 && testCount === 0;
  }
}));