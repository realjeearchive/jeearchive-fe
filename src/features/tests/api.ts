// src/features/tests/api.ts
import {
  TestSummary,
  TestDetails,
  Question,
} from "@/features/tests/types";
import {
  getDummyTestsByYear,
  getDummyTestDetails,
  getDummyQuestionsForTest,
} from "./dummy-data";

const SIMULATED_LATENCY_MS = 150;

export async function getTestsByYear(year: number): Promise<TestSummary[]> {
  const data = getDummyTestsByYear(year);
  return new Promise((resolve) =>
    setTimeout(() => resolve(data), SIMULATED_LATENCY_MS)
  );
}

export async function getTestDetails(testId: string): Promise<TestDetails> {
  const details = getDummyTestDetails(testId);
  if (!details) {
    throw new Error("Test not found");
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve(details), SIMULATED_LATENCY_MS)
  );
}

export interface TestAttemptData {
  test: TestDetails;
  questions: Question[];
}

export async function getTestAttemptData(
  testId: string
): Promise<TestAttemptData> {
  const test = await getTestDetails(testId);
  const questions = getDummyQuestionsForTest(testId);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ test, questions }), SIMULATED_LATENCY_MS)
  );
}
