// src/store/useAnalyticsStore.ts
"use client";

import { create } from "zustand";

// ==========================================
// NEW TYPES MATCHING BACKEND JSON STRUCTURE
// ==========================================

// Practice Analytics Types
export interface PracticeOverall {
  totalAttempts: number;
  totalTimeSpent: number;
  totalMarksEarned: number;
  totalMaxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface PracticeSubject {
  subjectId: string;
  subjectName: string;
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface PracticeQuestionType {
  questionType: string;
  attempts: number;
  timeSpent: number;
  marksEarned: number;
  maxPossible: number;
  accuracy: number;
  avgTimePerQuestion: number;
}

export interface PracticeAnalytics {
  overall: PracticeOverall;
  subjects: PracticeSubject[];
  questionTypes: PracticeQuestionType[];
}

// Subject Report Types
export interface SubjectReport {
  avgScore: number;
  avgMaxScore: number;
  avgAccuracy: number;
  avgPercentage: number;
  avgCorrect: number;
  avgWrong: number;
  avgTimeTaken: number;
  avgTimePerQuestion: number;
}

export interface QuestionTypeReport {
  avgScore: number;
  avgAccuracy: number;
  avgPercentage?: number;
  avgCorrect: number;
  avgWrong: number;
}

export interface ImprovementOverall {
  accuracyChange: number;
  scoreChange: number;
  avgTimePerQuestionChange: number;
}

export interface ImprovementSubject {
  accuracyChange: number;
  scoreChange: number;
  wrongChange: number;
}

export interface Improvement {
  overall: ImprovementOverall;
  subjects: {
    math: ImprovementSubject;
    physics: ImprovementSubject;
    chemistry: ImprovementSubject;
  };
}

export interface TestMarkItem {
  testId: string;
  examName: string;
  createdAt: string;
  marks: number;
  maxMarks: number;
  accuracy: number;
  percentage: number;
}

export interface TestReport {
  totalTests: number;
  totalAttempts: number;
  overall: {
    avgScore: number;
    avgPercentage: number;
    avgAccuracy: number;
    avgTimePerQuestion: number;
  };
  subjects: {
    math: SubjectReport;
    physics: SubjectReport;
    chemistry: SubjectReport;
  };
  questionTypes: Record<string, QuestionTypeReport>;
  improvement: Improvement;
  testMarksList: TestMarkItem[];
}

export interface TestReports {
  last3: TestReport;
  last5: TestReport;
  all: TestReport;
}

// Weak Chapter Types
export interface WeakChapter {
  chapterId: string;
  chapterName: string;
  percentage: number;
  accuracy: number;
  totalAttempts: number;
  totalMarks: number;
  totalMax: number;
}

export interface WeakChapters {
  Mathematics: WeakChapter[];
  Physics: WeakChapter[];
  Chemistry: WeakChapter[];
}

// Subject Analytics for a Single Test
export interface SubjectAnalytics {
  marks: number;
  maxMarks: number;
  correct: number;
  wrong: number;
  partial: number;
  attempt: number;
  timeTaken: number;
  totalQuestions: number;
  accuracy: number;
}

export interface OverAllAnalytics {
  totalScore: number;
  maxScore: number;
  timeTaken: number;
  totalQuestions: number;
  accuracy: number;
  percentage: number;
}

export interface QuestionWiseAnalytics {
  marks: number;
  maxMarks: number;
  correct: number;
  wrong: number;
  partial: number;
  attempt: number;
  timeTaken: number;
  totalQuestions: number;
  accuracy: number;
}

export interface PaperMeta {
  id: string;
  year: number;
  month: string;
  day: string;
  date: string;
  shift: string;
  mode: string;
  totalMarks: number;
  totalDuration: number;
  totalQuestions: number;
}

export interface AllTestDetail {
  id: string;
  created_at: string;
  source: string;
  exam: string;
  paperMeta: PaperMeta;
  math: SubjectAnalytics;
  physics: SubjectAnalytics;
  chemistry: SubjectAnalytics;
  overAllAnalytics: OverAllAnalytics;
  questionWise: Record<string, QuestionWiseAnalytics>;
  totalDuration: number;
}

// Exam Specific Analytics
export interface ExamAnalytics {
  practiceAnalytics: PracticeAnalytics;
  testReports: TestReports;
  weakChapters: WeakChapters;
  allTests: AllTestDetail[];
}

// Main Analytics Data Payload
export interface AnalyticsDataPayload {
  studentId: string;
  generatedAt: string;
  totalUniqueMockTests: number;
  overall: ExamAnalytics;
  jeeMain: ExamAnalytics;
  jeeAdvanced: ExamAnalytics;
}

// Store Interface
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
  isNewUser: () => {
    const data = get().rawAnalytics;
    return !data || !data.overall?.allTests || data.overall.allTests.length === 0;
  }
}));