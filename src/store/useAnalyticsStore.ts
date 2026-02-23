"use client";

import { create } from "zustand";

// --- STRICT TYPESCRIPT INTERFACES ---

export interface TestMarksListItem {
  testId: string;
  examName: string;
  createdAt: string;
  marks: number;
  maxMarks: number;
  accuracy: number;
}

export interface SubjectAgg {
  avgScore: number;
  avgMaxScore: number;
  avgAccuracy: number;
  avgCorrect: number;
  avgWrong: number;
  avgTimeTaken: number;
  avgTimePerQuestion: number;
}

export interface ExamReportOverall {
  avgScore: number;
  avgAccuracy: number;
  avgTimePerQuestion: number;
}

export interface ExamReport {
  totalTests: number;
  overall: ExamReportOverall;
  subjects: {
    math: SubjectAgg | null;
    physics: SubjectAgg | null;
    chemistry: SubjectAgg | null;
  };
}

export interface LastNGroup {
  lastNPerGroup: number;
  examReports: {
    JEE_MAIN?: ExamReport;
  };
  testMarksList: TestMarksListItem[];
}

export interface ChapterWiseAgg {
  chapterId: string;
  chapterName: string;
  subjectName: string;
  totalQuestions: number;
  attempt: number;
  correct: number;
  wrong: number;
  accuracy: number;
  marks: number;
}

export interface AllTestDetail {
  id: string;
  exam: string;
  created_at: string;
  overAllAnalytics: {
    totalScore: number;
    maxScore: number;
    overallAccuracy: number;
    totalTimeTaken: number;
  };
  chapterWise: ChapterWiseAgg[];
}

// MAIN PAYLOAD
export interface AnalyticsDataPayload {
  studentId: string;
  generatedAt: string;
  report: LastNGroup; // Typically represents all or a default N
  lastNTests: {
    last3: LastNGroup;
    last5: LastNGroup;
    last10: LastNGroup;
  };
  allTests: AllTestDetail[];
}

// --- ZUSTAND STORE ---
interface AnalyticsStore {
  rawAnalytics: AnalyticsDataPayload | null;
  isLoading: boolean;
  error: string | null;

  setAnalyticsData: (data: AnalyticsDataPayload) => void;
  setLoading: (val: boolean) => void;
  setError: (msg: string | null) => void;
  isNewUser: () => boolean;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  rawAnalytics: null,
  isLoading: true,
  error: null,

  setAnalyticsData: (data) => set({ rawAnalytics: data, isLoading: false, error: null }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg, isLoading: false }),

  // Determines if we show the empty state
  isNewUser: () => {
    const data = get().rawAnalytics;
    if (!data) return true;
    return !data.allTests || data.allTests.length === 0;
  }
}));