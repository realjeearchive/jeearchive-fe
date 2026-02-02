// src/features/tests/types.ts

// ==========================================
// 1. BACKEND DATA ENTITIES (Matches API Response)
// ==========================================

export interface BackendOptionsObject {
  id?: string;
  questionId?: string;
  // Options text might be missing/empty for Numerical types
  optionAtext?: string;
  optionBtext?: string;
  optionCtext?: string;
  optionDtext?: string;
  // Option images
  optionAimage?: string[];
  optionBimage?: string[];
  optionCimage?: string[];
  optionDimage?: string[];
}

export interface BackendAttemptStatus {
  // Supports single string (MCQ/Numeric) or array of strings (Multi-Correct)
  userAnswer: string | string[] | null; 
  isVisited: boolean;
  markedForReview: boolean;
  timeSpent: number;
  status: "NOT_VISITED" | "NOT_ANSWERED" | "ANSWERED" | "ATTEMPTED" | "REVIEW";
}

export interface BackendQuestion {
  id: string;
  questionNumber?: number; // Backend provided sequence number
  content: string;         // HTML string for the question body
  comprehensionContent?: string; // HTML string for the passage (if applicable)
  subject: string;
  type: string;            // e.g., "SingleCorrect", "MultiCorrect", "Integer"
  image?: string[]; 
  positiveMarks: number;
  negativeMarks: number;
  options?: BackendOptionsObject; // Optional because numericals might not have it
  correctAnswer?: string[];
  solution?: { text: string; image?: string[] };
  attemptStatus?: BackendAttemptStatus;
}

// ==========================================
// 2. ENGINE TYPES (Frontend Internal State)
// ==========================================

export interface TestOption {
  id: string; // "A", "B", "C", "D"
  label: string;
  text: string;
  imageUrl: string | null;
}

export interface TestQuestion {
  id: string;
  index: number; // Local index within the section (1, 2, 3...)
  globalQuestionNumber: number; // Global index (1 to 90...)
  kind: "single" | "numerical" | "multi" | "comprehension"; 
  
  // Content
  contentText: string;
  comprehensionContent?: string | null; // <--- ADDED: To render passage at top
  images: string[]; 
  contentImageUrl: string | null;
  
  options: TestOption[];
  
  // Scoring
  correctMarks: number;
  negativeMarks: number;
  sectionId: string;
}

export interface TestSection {
  id: string;
  label: string; // e.g., "Physics - Section A (MCQ)"
  subject: string;
  questions: TestQuestion[];
}

export interface TestDefinition {
  id: string;
  title: string;
  durationSeconds: number;
  sections: TestSection[];
}

// ==========================================
// 3. SESSION & API TYPES
// ==========================================

export interface Paper {
  id: string;
  examId: string;
  year: number;
  
  day?: string;
  month?: string;
  date?: string;
  shift?: string;
  mode?: string;
  
  totalMarks: number;
  totalDuration: number;
  totalQuestions: number;
  
  totalSingleChoice?: number;
  totalMultiChoice?: number;
  totalInteger?: number;
  
  exam?: { name: string };
}

export interface SessionMeta {
  testId: string;
  timeLeft: number;
  activeSection: string | null;
  activeQuestionId: string | null;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  startTime?: string;
}

// Dynamic structure because subjects (Physics/Chem/Math) are keys
export interface HierarchicalSessionData {
  session: SessionMeta;
  paper: Paper;
  [key: string]: unknown; 
}

export interface SessionDataResponse {
  message: string;
  data: HierarchicalSessionData; 
  success: boolean;
}

export interface LastTestStatusResponse {
  message: string;
  success: boolean;
  data: {
    status?: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
    testId?: string;
  };
}

export interface CreateTestResponse {
  message: string;
  success: boolean;
  data: {
    testId: string;
    status: string;
  };
}

export interface PaperApiResponse {
  message: string;
  data: Paper[];
  success: boolean;
}

export interface UpdateTestStatusPayload {
  testId: string;
  paperId: string;
  timeLeft: number;
  activeSection: string | null;
  activeQuestionId: string | null;
  state: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  timeStamp: string;
  questionStatus: Array<{
    questionId: string;
    // Updated to support Multi-Correct (Array) or Single/Numeric (String)
    userAnswer: string | string[] | null; 
    isVisited: boolean;
    markedForReview: boolean;
    timeSpent: number;
    status: string;
  }>;
}