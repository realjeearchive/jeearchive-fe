// src/features/tests/types.ts

// --- 1. BACKEND DATA ENTITIES ---

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
  userAnswer: string | string[] | null; 
  isVisited: boolean;
  markedForReview: boolean;
  timeSpent: number;
  status: "NOT_VISITED" | "NOT_ANSWERED" | "ANSWERED" | "ATTEMPTED" | "REVIEW";
}

export interface BackendQuestion {
  id: string;
  questionNumber?: number;
  content: string;
  subject: string;
  type: string; 
  image: string[]; 
  positiveMarks: number;
  negativeMarks: number;
  options: BackendOptionsObject;
  correctAnswer: string[];
  solution?: { text: string; image: string[] };
  attemptStatus?: BackendAttemptStatus;
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
  kind: "single" | "numerical" | "multi" | "comprehension"; 
  contentText: string;
  images: string[]; 
  contentImageUrl: string | null;
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

// --- 3. SESSION & API TYPES ---

export interface Paper {
  id: string;
  examId: string;
  year: number;
  
  // NEW FIELDS added to match backend data
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

export interface HierarchicalSessionData {
  session: SessionMeta;
  paper: Paper;
  [key: string]: unknown; // Allows dynamic subject keys like "Physics"
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
    userAnswer: string | null;
    isVisited: boolean;
    markedForReview: boolean;
    timeSpent: number;
    status: string;
  }>;
}