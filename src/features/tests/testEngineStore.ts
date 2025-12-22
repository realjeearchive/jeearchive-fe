// src/features/tests/testEngineStore.ts
"use client";

import { create } from "zustand";
import type { TestDefinition, TestQuestion, TestSection, QuestionKind } from "./types";

export type QuestionStatus =
  | "notVisited"
  | "notAnswered"
  | "answered"
  | "marked"
  | "answeredMarked";

export interface QuestionState {
  id: string;
  sectionId: string;
  index: number; // 1-based within section
  kind: QuestionKind;
  status: QuestionStatus;
  selectedOptionIds: string[];
  numericalAnswer?: string;
}

export interface SectionState {
  id: string;
  label: string;
  longTitle: string;
  subject: TestSection["subject"];
  questions: QuestionState[];
}

interface TestEngineState {
  testId: string | null;
  title: string;
  candidateName: string;
  durationSeconds: number;
  timeLeftSeconds: number;

  sections: SectionState[];
  questionsById: Record<string, TestQuestion>;
  activeSectionId: string | null;
  activeQuestionId: string | null;

  initFromDefinition: (def: TestDefinition) => void;

  setActiveSection: (sectionId: string) => void;
  setActiveQuestion: (questionId: string) => void;

  selectOption: (questionId: string, optionId: string) => void;
  setNumericalAnswer: (questionId: string, value: string) => void;
  clearResponse: (questionId: string) => void;

  markForReviewAndNext: () => void;
  saveAndNext: () => void;

  tickTimer: () => void;
}

export const useTestEngineStore = create<TestEngineState>((set, get) => ({
  testId: null,
  title: "",
  candidateName: "",
  durationSeconds: 0,
  timeLeftSeconds: 0,
  sections: [],
  questionsById: {},
  activeSectionId: null,
  activeQuestionId: null,

  initFromDefinition: def => {
    const questionsById: Record<string, TestQuestion> = {};

    const sections: SectionState[] = def.sections.map(section => {
      const questionStates: QuestionState[] = section.questions.map(q => {
        questionsById[q.id] = q;
        return {
          id: q.id,
          sectionId: section.id,
          index: q.index,
          kind: q.kind,
          status: "notVisited",
          selectedOptionIds: [],
        };
      });

      return {
        id: section.id,
        label: section.label,
        longTitle: section.longTitle,
        subject: section.subject,
        questions: questionStates,
      };
    });

    const firstSection = sections[0];
    const firstQuestion = firstSection?.questions[0];

    set({
      testId: def.id,
      title: def.title,
      candidateName: def.candidateName,
      durationSeconds: def.durationSeconds,
      timeLeftSeconds: def.durationSeconds,
      sections,
      questionsById,
      activeSectionId: firstSection?.id ?? null,
      activeQuestionId: firstQuestion?.id ?? null,
    });
  },

  setActiveSection: sectionId => {
    const state = get();
    const section = state.sections.find(s => s.id === sectionId);
    if (!section) return;
    const firstQuestion = section.questions[0];
    if (!firstQuestion) return;

    set({
      activeSectionId: sectionId,
      activeQuestionId: firstQuestion.id,
    });
  },

  setActiveQuestion: questionId => {
    set({ activeQuestionId: questionId });
  },

  selectOption: (questionId, optionId) => {
    set(state => ({
      sections: state.sections.map(sec => ({
        ...sec,
        questions: sec.questions.map(q => {
          if (q.id !== questionId) return q;

          if (q.kind === "single") {
            return {
              ...q,
              selectedOptionIds: [optionId],
              status: q.status === "notVisited" ? "notAnswered" : q.status,
            };
          }

          // multi in future; for now just single/numerical
          return q;
        }),
      })),
    }));
  },

  setNumericalAnswer: (questionId, value) => {
    set(state => ({
      sections: state.sections.map(sec => ({
        ...sec,
        questions: sec.questions.map(q =>
          q.id === questionId
            ? {
                ...q,
                numericalAnswer: value,
                status: value
                  ? q.status === "notVisited"
                    ? "notAnswered"
                    : q.status
                  : q.status,
              }
            : q
        ),
      })),
    }));
  },

  clearResponse: questionId => {
    set(state => ({
      sections: state.sections.map(sec => ({
        ...sec,
        questions: sec.questions.map(q =>
          q.id === questionId
            ? {
                ...q,
                selectedOptionIds: [],
                numericalAnswer: undefined,
                status:
                  q.status === "answered" || q.status === "answeredMarked"
                    ? "notAnswered"
                    : q.status,
              }
            : q
        ),
      })),
    }));
  },

  markForReviewAndNext: () => {
    const state = get();
    const { activeSectionId, activeQuestionId } = state;
    if (!activeSectionId || !activeQuestionId) return;

    const { sections, nextQuestion } = mutateQuestionAndGetNext(
      state,
      activeQuestionId,
      statusBefore =>
        statusBefore === "answered" || statusBefore === "answeredMarked"
          ? "answeredMarked"
          : "marked"
    );

    set({
      sections,
      activeQuestionId: nextQuestion?.id ?? activeQuestionId,
      activeSectionId: nextQuestion?.sectionId ?? activeSectionId,
    });
  },

  saveAndNext: () => {
    const state = get();
    const { activeSectionId, activeQuestionId } = state;
    if (!activeSectionId || !activeQuestionId) return;

    const { sections, nextQuestion } = mutateQuestionAndGetNext(
      state,
      activeQuestionId,
      () => "answered"
    );

    set({
      sections,
      activeQuestionId: nextQuestion?.id ?? activeQuestionId,
      activeSectionId: nextQuestion?.sectionId ?? activeSectionId,
    });
  },

  tickTimer: () => {
    set(state => ({
      timeLeftSeconds: Math.max(0, state.timeLeftSeconds - 1),
    }));
  },
}));

function mutateQuestionAndGetNext(
  state: TestEngineState,
  questionId: string,
  computeStatus: (prevStatus: QuestionStatus) => QuestionStatus
) {
  let nextQuestion: QuestionState | undefined;

  const sections = state.sections.map(sec => {
    const qs = sec.questions;
    const idx = qs.findIndex(q => q.id === questionId);
    if (idx === -1) return sec;

    const q = qs[idx];
    const newStatus = computeStatus(q.status);

    const updatedQuestions = [...qs];
    updatedQuestions[idx] = { ...q, status: newStatus };

    const next = qs[idx + 1];
    if (next) nextQuestion = next;

    return { ...sec, questions: updatedQuestions };
  });

  return { sections, nextQuestion };
}
