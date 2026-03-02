// src/features/analytics/singleTestTransformer.ts

export interface TransformedSingleTestUI {
  meta: {
    myScore: number;
    totalMarks: number;
    accuracy: number;
    timeTaken: number; 
    predictedPercentile: string;
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

// A strict interface to handle the varying backend key names without using 'any'
export interface RawAnalyticsInput {
  overall?: Record<string, number>;
  overAllAnalytics?: Record<string, number>;
  math?: Record<string, number> | null;
  physics?: Record<string, number> | null;
  chemistry?: Record<string, number> | null;
}

// Accept 'unknown' to satisfy strict TS rules, then cast to our safe interface
export const transformSingleTestData = (rawData: unknown): TransformedSingleTestUI | null => {
  if (!rawData) return null;

  const data = rawData as RawAnalyticsInput;

  // 1. Handle backend naming inconsistencies (overall vs overAllAnalytics)
  const overallData = data.overall || data.overAllAnalytics || {};

  // 2. Safe Fallbacks for Subjects
  const math = data.math || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };
  const phy = data.physics || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };
  const chem = data.chemistry || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };

  // 3. Extract exact values (Accounting for keys with spaces in backend JSON)
  const myScore = overallData.totalScore ?? (math.marks + phy.marks + chem.marks);
  const totalMarks = overallData.maxScore ?? 300;
  
  const positiveScore = (math.positiveMarks || 0) + (phy.positiveMarks || 0) + (chem.positiveMarks || 0);
  const negativeScore = (math.negativeMarks || 0) + (phy.negativeMarks || 0) + (chem.negativeMarks || 0);
  
  // Safely extract values looking for both formats the backend sends
  const totalQs = overallData.totalQuestions || overallData["total Questions"] || 75;
  const attempted = overallData.totalAttempted || overallData.attempt || 0;
  const correct = overallData.totalCorrect || overallData.correct || 0;
  const timeTakenSecs = overallData.totalTimeTaken || overallData["total Time Taken"] || 0;
  const accuracy = overallData.overallAccuracy || overallData.accuracy || 0;

  const percentile = myScore > 0 ? Math.min(99.99, (myScore / totalMarks) * 100 + 40).toFixed(2) : "0.00";

  return {
    meta: {
      myScore: myScore,
      totalMarks: totalMarks, 
      accuracy: Number(accuracy.toFixed(1)),
      timeTaken: Math.round(timeTakenSecs / 60), 
      predictedPercentile: percentile
    },
    stats: {
      correct: correct,
      attempted: attempted,
      totalQs: totalQs,
      positiveScore: positiveScore,
      negativeScore: negativeScore
    },
    subjects: {
      maths: { name: "Mathematics", score: math.marks, total: totalMarks/3, attempted: math.attempt, accuracy: Math.round(math.accuracy), time: Math.round(math.timeTaken / 60) },
      physics: { name: "Physics", score: phy.marks, total: totalMarks/3, attempted: phy.attempt, accuracy: Math.round(phy.accuracy), time: Math.round(phy.timeTaken / 60) },
      chemistry: { name: "Chemistry", score: chem.marks, total: totalMarks/3, attempted: chem.attempt, accuracy: Math.round(chem.accuracy), time: Math.round(chem.timeTaken / 60) }
    }
  };
};