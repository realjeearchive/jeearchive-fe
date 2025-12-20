// src/features/tests/useTestAttemptStore.ts
"use client";

import { create } from "zustand";
import {
  Question,
  TestDetails,
  TestAttemptClientState,
  QuestionResponseState,
} from "@/features/tests/types";

interface TestAttemptStore extends TestAttemptClientState {
  test: TestDetails | null;
  questions: Question[];

  loadAttempt(test: TestDetails, questions: Question[]): void;
  goToQuestion(id: string): void;
  answerSingleChoice(questionId: string, optionId: string): void;
  toggleMarkForReview(questionId: string): void;
}

const initialState: TestAttemptClientState & {
  test: TestDetails | null;
  questions: Question[];
} = {
  testId: "",
  currentQuestionId: "",
  responses: {},
  remainingSeconds: 180 * 60,
  status: "not_started",
  test: null,
  questions: [],
};

export const useTestAttemptStore = create<TestAttemptStore>((set, get) => ({
  ...initialState,

  loadAttempt(test, questions) {
    if (!questions.length) return;

    const responses: Record<string, QuestionResponseState> = {};
    for (const q of questions) {
      responses[q.id] = { visited: false, markedForReview: false };
    }

    set({
      test,
      questions,
      testId: test.summary.id,
      currentQuestionId: questions[0].id,
      responses,
      remainingSeconds: test.summary.durationMinutes * 60,
      status: "in_progress",
    });
  },

  goToQuestion(id) {
    const { responses } = get();
    if (responses[id]) {
      responses[id] = { ...responses[id], visited: true };
    }
    set({ currentQuestionId: id, responses: { ...responses } });
  },

  answerSingleChoice(questionId, optionId) {
    const { responses } = get();
    const prev = responses[questionId] ?? {
      visited: true,
      markedForReview: false,
    };
    responses[questionId] = {
      ...prev,
      visited: true,
      answerOptionId: optionId,
    };
    set({ responses: { ...responses } });
  },

  toggleMarkForReview(questionId) {
    const { responses } = get();
    const prev = responses[questionId] ?? {
      visited: false,
      markedForReview: false,
    };
    responses[questionId] = {
      ...prev,
      markedForReview: !prev.markedForReview,
    };
    set({ responses: { ...responses } });
  },
}));
