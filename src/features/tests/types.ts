// src/features/tests/types.ts

// ---------- List / overview ----------

export interface TestSummary {
  id: string; // "jee-main-2021-24-feb-shift-1"
  exam: "JEE_MAIN" | "JEE_ADVANCED";
  year: number;
  shift?: string;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  slug?: string;
}

export interface SectionMarkingScheme {
  sectionId: string;        // "M_SC", "M_NUM"
  name: string;             // "Mathematics Single Correct"
  subject: "PHYSICS" | "CHEMISTRY" | "MATHEMATICS";
  questionCount: number;
  marksCorrect: number;
  marksIncorrect: number;
  marksUnattempted: number;
}

export interface TestDetails {
  summary: TestSummary;
  sections: SectionMarkingScheme[];
  syllabusSummary?: string;
  instructions?: string[];
}

// ---------- Raw question data from backend/dummy ----------

export type QuestionType = "SC" | "NUM"; // Single correct / Numerical

export interface QuestionOption {
  id: string;       // "A" | "B" | "C" | "D"
  text: string;     // plain text; later can be HTML/LaTeX
  imageUrl?: string;
}

export interface Question {
  id: string;
  testId: string;

  questionNumber: number;           // 1..N (global)
  sectionId: string;                // e.g. "M_SC"
  subject: "PHYSICS" | "CHEMISTRY" | "MATHEMATICS";
  type: QuestionType;

  questionText: string;
  questionImageUrl?: string;
  options?: QuestionOption[];

  correctOptionId?: string;
  correctNumericAnswer?: number | string;

  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topic?: string;
  subtopic?: string;
}

// ---------- Test-player engine model ----------

// Engine-friendly normalized structures derived in frontend

export type QuestionKind = "single" | "numerical"; // multi not needed yet

export interface TestOption {
  id: string;
  label: string; // "A", "B", "C", "D"
  text: string;
  imageUrl?: string;
}

export interface TestQuestion {
  id: string;
  index: number; // 1-based within section
  kind: QuestionKind;
  contentText: string;
  contentImageUrl?: string;
  options: TestOption[]; // empty for numerical
  correctMarks: number;
  negativeMarks: number;
  sectionId: string;
  globalQuestionNumber: number;
}

export interface TestSection {
  id: string;           // "M_SC"
  label: string;        // "Mathematics Single Correct"
  longTitle: string;    // "Mathematics Single Correct (Maximum Marks: 80)"
  subject: "PHYSICS" | "CHEMISTRY" | "MATHEMATICS";
  questions: TestQuestion[];
}

export interface TestDefinition {
  id: string;
  title: string;
  durationSeconds: number;
  candidateName: string;
  sections: TestSection[];
}
