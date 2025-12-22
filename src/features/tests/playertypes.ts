// ---------- Test Player Runtime State ----------

export type QuestionStatus =
  | "notVisited"
  | "notAnswered"
  | "answered"
  | "marked"
  | "answeredMarked";

export interface QuestionPlayerState {
  globalQuestionNumber: number; // maps to Question.questionNumber
  sectionId: string;
  status: QuestionStatus;
}

export interface TestPlayerState {
  currentSectionId: string;
  currentQuestionNumber: number; // global question number
  questions: QuestionPlayerState[];
}

export interface QuestionAttempt {
  questionId: string;
  selectedOptionId?: string;
  status: QuestionStatus;
}
