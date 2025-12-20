// src/features/tests/types.ts

// High‑level info for list pages
export interface TestSummary {
  id: string;               // "jee-main-2021-24-feb-shift-1"
  exam: "JEE_MAIN" | "JEE_ADVANCED";
  year: number;
  shift?: string;           // "24 Feb Shift 1"
  title: string;            // "JEE Main 2021 (24 Feb Shift 1)"
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  slug?: string;            // optional pretty slug
}

// Per‑section marking scheme
export interface SectionMarkingScheme {
  sectionId: string;        // "M_SC", "M_NUM"
  name: string;             // "Mathematics Single Correct"
  subject: "PHYSICS" | "CHEMISTRY" | "MATHEMATICS";
  questionCount: number;
  marksCorrect: number;
  marksIncorrect: number;
  marksUnattempted: number;
}

// Full details for overview + player header
export interface TestDetails {
  summary: TestSummary;
  sections: SectionMarkingScheme[];
  syllabusSummary?: string;
  instructions?: string[];
}

// Question option (MCQ)
export interface QuestionOption {
  id: string;         // "A" | "B" | "C" | "D"
  text: string;       // plain text or HTML string
}

// Question type
export type QuestionType = "SC" | "NUM"; // Single correct / Numerical

// One question inside a test
export interface Question {
  id: string;                 // stable id
  testId: string;

  questionNumber: number;     // 1..N as shown to user
  sectionId: string;          // e.g. "M_SC"
  subject: "PHYSICS" | "CHEMISTRY" | "MATHEMATICS";
  type: QuestionType;

  questionText: string;       // HTML string (only English)
  options?: QuestionOption[]; // required if type === "SC"

  correctOptionId?: string;   // for SC
  correctNumericAnswer?: number | string; // for NUM (may be tolerance later)

  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topic?: string;             // "Differential Calculus"
  subtopic?: string;
  // you can extend later (solutionText, images, etc.)
}

// Frontend attempt state (client‑only for now)
export interface QuestionResponseState {
  visited: boolean;
  answerOptionId?: string;    // for SC
  answerNumericValue?: string;// for NUM, keep as string to match input
  markedForReview: boolean;
}

export interface TestAttemptClientState {
  testId: string;
  currentQuestionId: string;
  responses: Record<string, QuestionResponseState>;
  remainingSeconds: number;
  status: "not_started" | "in_progress" | "submitted";
}
