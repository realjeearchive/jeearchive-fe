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

export interface QuestionTypeAgg {
  avgScore: number;
  avgAccuracy: number;
  avgCorrect: number;
  avgWrong: number;
}

export interface ImprovementStats {
  accuracyChange: number;
  scoreChange: number;
  avgTimePerQuestionChange: number;
}

export interface ExamReport {
  totalTests: number;
  overall: ExamReportOverall;
  subjects: {
    math: SubjectAgg | null;
    physics: SubjectAgg | null;
    chemistry: SubjectAgg | null;
  };
  // Newly added fields matching your updated JSON
  questionTypes: {
    MCQ?: QuestionTypeAgg;
    NUMERICAL?: QuestionTypeAgg;
    MSQ?: QuestionTypeAgg;
  };
  improvement: {
    overall: ImprovementStats;
    subjects: Record<string, unknown> | null;
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
  timeTaken: number;
}

export interface AllTestDetail {
  id: string;
  exam: string;
  created_at: string;
  source: string;
  overAllAnalytics: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    overallAccuracy: number;
    totalTimeTaken: number;
    averageTimePerQuestion: number;
  };
  chapterWise: ChapterWiseAgg[];
}

// MAIN PAYLOAD
export interface AnalyticsDataPayload {
  studentId: string;
  generatedAt: string;
  report: LastNGroup;
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