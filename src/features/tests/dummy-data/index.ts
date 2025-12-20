// src/features/tests/dummy-data/index.ts
import {
  jeeMain2021Shift1Details,
  jeeMain2021Shift1Questions,
} from "./jeeMain2021Shift1";
import { TestDetails, TestSummary, Question } from "@/features/tests/types";

const detailsById: Record<string, TestDetails> = {
  [jeeMain2021Shift1Details.summary.id]: jeeMain2021Shift1Details,
};

const questionsByTestId: Record<string, Question[]> = {
  [jeeMain2021Shift1Details.summary.id]: jeeMain2021Shift1Questions,
};

// For year list pages:
export function getDummyTestsByYear(year: number): TestSummary[] {
  return Object.values(detailsById)
    .filter((d) => d.summary.year === year)
    .map((d) => d.summary);
}

export function getDummyTestDetails(testId: string): TestDetails | undefined {
  return detailsById[testId];
}

export function getDummyQuestionsForTest(testId: string): Question[] {
  return questionsByTestId[testId] ?? [];
}
