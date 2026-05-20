// src/features/analytics/singleTestTransformer.ts

import { SingleTestPayload } from "./singleTestApi";

export interface TransformedSingleTestUI {
  meta: {
    myScore: number;
    totalMarks: number;
    accuracy: number;
    timeTaken: number;
    examType: "MAIN" | "ADVANCED";
  };
  stats: {
    correct: number;
    attempted: number;
    totalQs: number;
    positiveScore: number;
    negativeScore: number;
  };
  subjects: {
    maths: { name: string; score: number; total: number; attempted: number; accuracy: number; time: number };
    physics: { name: string; score: number; total: number; attempted: number; accuracy: number; time: number };
    chemistry: { name: string; score: number; total: number; attempted: number; accuracy: number; time: number };
  };
}

export const transformSingleTestData = (rawData: SingleTestPayload | null): TransformedSingleTestUI | null => {
  if (!rawData) return null;

  const { math, physics, chemistry, overall, exam } = rawData;

  // Calculate total marks based on exam type
  const isAdvanced = exam?.toLowerCase().includes("advanced") || false;
  const totalMarks = isAdvanced ? 180 : 300;
  const marksPerSubject = totalMarks / 3;

  // My Score (total marks obtained)
  const myScore = (math?.marks || 0) + (physics?.marks || 0) + (chemistry?.marks || 0);

  // Positive and Negative scores
  const positiveScore = (math?.positiveMarks || 0) + (physics?.positiveMarks || 0) + (chemistry?.positiveMarks || 0);
  const negativeScore = (math?.negativeMarks || 0) + (physics?.negativeMarks || 0) + (chemistry?.negativeMarks || 0);

  // Stats from overall
  const totalQs = overall?.totalQuestions || 75;
  const attempted = overall?.totalAttempted || 0;
  const correct = overall?.totalCorrect || 0;
  const accuracy = overall?.overallAccuracy || 0;
  const timeTakenSecs = overall?.totalTimeTaken || 0;

  return {
    meta: {
      myScore: myScore,
      totalMarks: totalMarks,
      accuracy: Number(accuracy.toFixed(1)),
      timeTaken: Math.round(timeTakenSecs / 60), // Convert seconds to minutes
      examType: isAdvanced ? "ADVANCED" : "MAIN",
    },
    stats: {
      correct: correct,
      attempted: attempted,
      totalQs: totalQs,
      positiveScore: positiveScore,
      negativeScore: negativeScore,
    },
    subjects: {
      maths: {
        name: "Mathematics",
        score: math?.marks || 0,
        total: marksPerSubject,
        attempted: math?.attempt || 0,
        accuracy: Math.round(math?.accuracy || 0),
        time: Math.round((math?.timeTaken || 0) / 60),
      },
      physics: {
        name: "Physics",
        score: physics?.marks || 0,
        total: marksPerSubject,
        attempted: physics?.attempt || 0,
        accuracy: Math.round(physics?.accuracy || 0),
        time: Math.round((physics?.timeTaken || 0) / 60),
      },
      chemistry: {
        name: "Chemistry",
        score: chemistry?.marks || 0,
        total: marksPerSubject,
        attempted: chemistry?.attempt || 0,
        accuracy: Math.round(chemistry?.accuracy || 0),
        time: Math.round((chemistry?.timeTaken || 0) / 60),
      },
    },
  };
};