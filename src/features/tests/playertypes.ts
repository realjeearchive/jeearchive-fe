// src/features/tests/playertypes.ts

export type QuestionStatus =
  | "notVisited"        // White (Default)
  | "notAnswered"       // Red (Visited but skipped)
  | "answered"          // Green (Saved)
  | "markedForReview"   // Purple (Marked without answer)
  | "answeredAndMarked"; // Purple with Green Dot (Marked with answer - Evaluated)

export type QuestionKind = "single" | "numerical";

// The state of a single question during the test
export interface QuestionState {
  questionId: string;
  globalQuestionNumber: number; // 1 to 75
  status: QuestionStatus;
  selectedOptionIds: string[]; // Array of IDs (e.g. ["A"])
  numericAnswer: string | null; // For numerical questions
  isVisited: boolean;
  isBookmarked: boolean;
  
  // NEW: Metric to track time spent on this specific question
  timeSpentSeconds: number; 
}

// Summary stats for the sidebar
export interface SectionStats {
  sectionId: string;
  answered: number;
  notAnswered: number;
  notVisited: number;
  markedForReview: number;
  answeredAndMarked: number;
}