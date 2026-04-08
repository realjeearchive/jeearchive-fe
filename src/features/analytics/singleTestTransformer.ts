// src/features/analytics/singleTestTransformer.ts

export interface TransformedSingleTestUI {
  meta: {
    myScore: number;
    totalMarks: number;
    accuracy: number;
    timeTaken: number; 
    examType: "MAIN" | "ADVANCED"; // 🚨 NEW: Added exam type tracking
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

export interface RawAnalyticsInput {
  testName?: string; // For dynamic extraction
  name?: string;
  overall?: Record<string, number | string>;
  overAllAnalytics?: Record<string, number>;
  math?: Record<string, number> | null;
  physics?: Record<string, number> | null;
  chemistry?: Record<string, number> | null;
}

export const transformSingleTestData = (rawData: unknown): TransformedSingleTestUI | null => {
  if (!rawData) return null;

  const data = rawData as RawAnalyticsInput;
  const overallData = data.overall || data.overAllAnalytics || {};

  const math = data.math || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };
  const phy = data.physics || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };
  const chem = data.chemistry || { marks: 0, attempt: 0, accuracy: 0, timeTaken: 0, positiveMarks: 0, negativeMarks: 0 };

  const myScore = (overallData.totalScore as number) ?? (math.marks + phy.marks + chem.marks);
  const totalMarks = (overallData.maxScore as number) ?? 300;
  
  const positiveScore = (math.positiveMarks || 0) + (phy.positiveMarks || 0) + (chem.positiveMarks || 0);
  const negativeScore = (math.negativeMarks || 0) + (phy.negativeMarks || 0) + (chem.negativeMarks || 0);
  
  const totalQs = (overallData.totalQuestions as number) || (overallData["total Questions"] as number) || 75;
  const attempted = (overallData.totalAttempted as number) || (overallData.attempt as number) || 0;
  const correct = (overallData.totalCorrect as number) || (overallData.correct as number) || 0;
  const timeTakenSecs = (overallData.totalTimeTaken as number) || (overallData["total Time Taken"] as number) || 0;
  const accuracy = (overallData.overallAccuracy as number) || (overallData.accuracy as number) || 0;

  // 🚨 FIX: Extract exam type dynamically based on Test Name or Total Marks
  const testNameStr = (data.testName || data.name || "").toLowerCase();
  const isAdvanced = testNameStr.includes("advanced") || totalMarks !== 300;
  const examType = isAdvanced ? "ADVANCED" : "MAIN";

  return {
    meta: {
      myScore: myScore,
      totalMarks: totalMarks, 
      accuracy: Number(accuracy.toFixed(1)),
      timeTaken: Math.round(timeTakenSecs / 60), 
      examType: examType, // Passes to the UI
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