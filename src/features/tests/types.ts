// src/features/tests/types.ts

// --- 1. BACKEND DATA ENTITIES (Matches DB/API) ---

export interface BackendOptionsObject {
  id: string;
  questionId: string;
  optionAtext: string;
  optionBtext: string;
  optionCtext: string;
  optionDtext: string;
  optionAimage: string[];
  optionBimage: string[];
  optionCimage: string[];
  optionDimage: string[];
}

export interface BackendAttemptStatus {
  // Backend sends mixed types for userAnswer (string, array, or null)
  userAnswer: string | string[] | null; 
  isVisited: boolean;
  markedForReview: boolean;
  timeSpent: number;
  status: "NOT_VISITED" | "NOT_ANSWERED" | "ANSWERED" | "ATTEMPTED" | "REVIEW";
}

export interface BackendQuestion {
  id: string;
  content: string;
  subject: string;
  type: string; // "SingleChoice", "Integer", etc.
  image: string[]; // Backend sends an ARRAY
  positiveMarks: number;
  negativeMarks: number;
  options: BackendOptionsObject;
  correctAnswer: string[];
  solution?: { text: string; image: string[] };

  // NEW: The Attempt Status coming from "Get Session" API
  // It is optional because raw paper fetch might not have it
  attemptStatus?: BackendAttemptStatus;
  
  questionNumber?: number; 
}

// --- 2. ENGINE TYPES (Frontend Internal State) ---

export interface TestOption {
  id: string;
  label: string;
  text: string;
  imageUrl: string | null;
}

export interface TestQuestion {
  id: string;
  index: number;
  globalQuestionNumber: number;
  kind: "single" | "numerical";
  contentText: string;
  
  // Images for the question content
  images: string[]; 
  contentImageUrl: string | null; // Compatibility field
  
  options: TestOption[];
  correctMarks: number;
  negativeMarks: number;
  sectionId: string;
}

export interface TestSection {
  id: string;
  label: string;
  subject: string;
  questions: TestQuestion[];
}

export interface TestDefinition {
  id: string;
  title: string;
  durationSeconds: number;
  sections: TestSection[];
}

// --- 3. PAPER LIST TYPES ---

export interface Paper {
  id: string;
  examId: string;
  year: number;
  day: string;
  month: string;
  date: string;
  shift: string;
  mode: string;
  totalMarks: number;
  totalDuration: number;
  totalQuestions: number;
  totalSingleChoice: number;
  totalMultiChoice: number;
  totalInteger: number;
  exam?: { name: string };
}

export interface PaperApiResponse {
  message: string;
  data: Paper[];
  success: boolean;
}

// --- 4. SESSION & API RESPONSE TYPES (New) ---

// Response for: GET /api/testStatus/getPaper?testStatusId=...
export interface SessionDataResponse {
  testId: string;
  timeLeft: number;
  activeSection: string | null;
  activeQuestionId: string | null;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  paper: Paper;
  questions: BackendQuestion[];
}

// Response for: GET /api/testStatus/lastTestDetails?paperId=...
export interface LastTestStatusData {
  status?: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  created_at?: string;
  testId?: string; // This is the SESSION ID
}

export interface LastTestStatusResponse {
  message: string;
  success: boolean;
  data: LastTestStatusData; // Can be empty object {} if no test found
}

// Response for: POST /api/testStatus/create
export interface CreateTestResponse {
  message: string;
  success: boolean;
  data: {
    testId: string; // The new Session ID
    status: string;
    message: string;
  };
}

// Payload for: POST /api/testStatus/update
export interface UpdateTestStatusPayload {
  testId: string;
  paperId: string;
  timeLeft: number;
  activeSection: string | null;
  activeQuestionId: string | null;
  state: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  timeStamp: string;
  created_at?: string;
  questionStatus: Array<{
    questionId: string;
    userAnswer: string | null;
    isVisited: boolean;
    markedForReview: boolean;
    timeSpent: number;
    status: string;
  }>;
}