// src/features/tests/api.ts
import {
  TestSummary,
  TestDetails,
  Question,
  TestDefinition,
  TestSection,
  TestQuestion,
  QuestionKind,
} from "@/features/tests/types";
import {
  getDummyTestsByYear,
  getDummyTestDetails,
  getDummyQuestionsForTest,
} from "./dummy-data";

const SIMULATED_LATENCY_MS = 150;

export async function getTestsByYear(year: number): Promise<TestSummary[]> {
  const data = getDummyTestsByYear(year);
  return new Promise(resolve =>
    setTimeout(() => resolve(data), SIMULATED_LATENCY_MS)
  );
}

export async function getTestDetails(testId: string): Promise<TestDetails> {
  const details = getDummyTestDetails(testId);
  if (!details) {
    throw new Error("Test not found");
  }
  return new Promise(resolve =>
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
  return new Promise(resolve =>
    setTimeout(() => resolve({ test, questions }), SIMULATED_LATENCY_MS)
  );
}

// ---------- NEW: Convert to TestDefinition for engine ----------

export function buildTestDefinition(
  attempt: TestAttemptData,
  candidateName: string
): TestDefinition {
  const { test, questions } = attempt;

  const sections: TestSection[] = test.sections.map(section => {
    const sectionQuestions = questions
      .filter(q => q.sectionId === section.sectionId)
      .sort((a, b) => a.questionNumber - b.questionNumber);

    const testQuestions: TestQuestion[] = sectionQuestions.map((q, idx) => {
      const kind: QuestionKind = q.type === "SC" ? "single" : "numerical";

      return {
        id: q.id,
        index: idx + 1,
        kind,
        contentText: q.questionText,
        contentImageUrl: q.questionImageUrl,
        options:
          kind === "single" && q.options
            ? q.options.map(opt => ({
                id: opt.id,
                label: opt.id,
                text: opt.text,
                imageUrl: opt.imageUrl,
              }))
            : [],
        correctMarks: section.marksCorrect,
        negativeMarks: section.marksIncorrect,
        sectionId: section.sectionId,
        globalQuestionNumber: q.questionNumber,
      };
    });

    return {
      id: section.sectionId,
      label: section.name,
      longTitle: `${section.name} (Maximum Marks: ${
        section.questionCount * section.marksCorrect
      })`,
      subject: section.subject,
      questions: testQuestions,
    };
  });

  return {
    id: test.summary.id,
    title: test.summary.title,
    durationSeconds: test.summary.durationMinutes * 60,
    candidateName,
    sections,
  };
}
