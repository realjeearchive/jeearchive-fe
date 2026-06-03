import React from 'react';
import { FiAward, FiClock, FiTarget, FiCheckSquare, FiActivity, FiCrosshair } from 'react-icons/fi';
import { DashboardDataPayload, DashboardTestAttempt, SubjectPractice, QuestionTypeStat } from '@/store/useDashboardStore';
import { ExamFilter } from '@/components/dashboard/DashboardHeader/DashboardHeader';

const getSubjectName = (id: string, index: number): string => {
  const map: Record<string, string> = {
    "8c36e7ff-2ede-453a-9048-c1e101ed627e": "Mathematics",
    "447bd2dc-9a10-4620-81e6-d02b6d3897e2": "Physics",
    "34546fed-8b2d-42d8-9f18-099f16331870": "Chemistry"
  };
  const fallback = ["Physics", "Chemistry", "Mathematics"];
  return map[id] || fallback[index] || "Unknown";
};

// 🚨 NEW: Helper to shorten question type labels for the Bar Chart
const getShortQType = (type: string): string => {
  const map: Record<string, string> = {
    "SingleCorrect": "SCQ",
    "MultiCorrect": "MCQ",
    "Integer": "Numerical",
    "ComprehensionSingleCorrect": "Comp (SCQ)",
    "ComprehensionMultiCorrect": "Comp (MCQ)",
    "ComprehensionInteger": "Comp (Num)"
  };
  return map[type] || type;
};

// --- CALCULATE PRACTICE OVERALL (Bypasses Backend Zeroes) ---
const calculatePracticeOverall = (subjects: SubjectPractice[] | undefined) => {
  if (!subjects || subjects.length === 0) return null;

  let totalAttempts = 0;
  let totalMarksEarned = 0;
  let totalMaxPossible = 0;
  let totalTimeSpent = 0;

  subjects.forEach((sub) => {
    totalAttempts += sub.attempts || 0;
    totalMarksEarned += sub.marksEarned || 0;
    totalMaxPossible += sub.maxPossible || 0;
    totalTimeSpent += sub.timeSpent || 0;
  });

  const accuracy = totalMaxPossible > 0 ? (totalMarksEarned / totalMaxPossible) * 100 : 0;
  const avgTimePerQuestion = totalAttempts > 0 ? totalTimeSpent / totalAttempts : 0;

  // We return true if there was ANY activity, regardless of backend's 'overall' object
  const hasActivity = totalAttempts > 0;

  return { totalAttempts, totalMarksEarned, accuracy, avgTimePerQuestion, hasActivity };
};

export const transformDashboardData = (data: DashboardDataPayload | null, examFilter: ExamFilter = "overall") => {
  if (!data) return null;

  const { tests, practice, uniqueQuestionsAttempted } = data;

  const last5Tests = tests?.[examFilter]?.last5 || [];
  const testAggregates = tests?.[examFilter]?.aggregate;
  const practiceCategory = practice?.[examFilter];
  
  // 🚨 NEW: Calculate our own overall stats!
  const computedPracticeOverall = calculatePracticeOverall(practiceCategory?.subjects);

  // 🚨 FIX: Changed ?? to || so that a backend value of 0 triggers the 1200 fallback
  const progress = {
    phy: { 
      solved: uniqueQuestionsAttempted?.subjectWise?.Physics?.uniqueAttempted || 0, 
      total: uniqueQuestionsAttempted?.subjectWise?.Physics?.totalQuestions || 4469 
    },
    chem: { 
      solved: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.uniqueAttempted || 0, 
      total: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.totalQuestions || 4467 
    },
    math: { 
      solved: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.uniqueAttempted || 0, 
      total: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.totalQuestions || 4471 
    },
  };

  const avgTestAcc = testAggregates?.overallAccuracy ?? 0;
  const testsIncluded = testAggregates?.testsIncluded || 1;
  const avgTestScore = testAggregates?.totalMarks ? testAggregates.totalMarks / testsIncluded : 0;
  const totalMocks = testAggregates?.testsIncluded || data.totalUniqueMockTests || 0;

  const testKpis = [
    { label: "Mock Accuracy", value: `${avgTestAcc.toFixed(1)}%`, sub: "Avg in recent tests", icon: React.createElement(FiTarget, { size: 16 }) },
    { label: "Avg Score", value: Math.round(avgTestScore).toString(), sub: "Per Test Average", icon: React.createElement(FiActivity, { size: 16 }) },
    { label: "AIR Prediction", value: "--", sub: "Take more tests to unlock", icon: React.createElement(FiAward, { size: 16 }) },
    { label: "Mocks Attempted", value: totalMocks.toString(), sub: "Total tests recorded", icon: React.createElement(FiCheckSquare, { size: 16 }) },
  ];

  // 🚨 NEW: Bind calculated stats to Chapter KPIs
  const chapterKpis = [
    { 
      label: "Practice Accuracy", 
      value: computedPracticeOverall?.hasActivity ? `${computedPracticeOverall.accuracy.toFixed(1)}%` : "--", 
      sub: "Overall chapter accuracy", 
      icon: React.createElement(FiCrosshair, { size: 16 }) 
    },
    { 
      label: "Avg Time", 
      value: computedPracticeOverall?.hasActivity ? `${Math.round(computedPracticeOverall.avgTimePerQuestion)}s` : "--", 
      sub: "Per question", 
      icon: React.createElement(FiClock, { size: 16 }) 
    },
    { 
      label: "Total Marks", 
      value: computedPracticeOverall?.totalMarksEarned.toString() ?? "0", 
      sub: "Earned in practice", 
      icon: React.createElement(FiAward, { size: 16 }) 
    },
    { 
      label: "Questions Solved", 
      value: computedPracticeOverall?.totalAttempts.toString() ?? "0", 
      sub: "Total attempts made", 
      icon: React.createElement(FiCheckSquare, { size: 16 }) 
    },
  ];

  const scoreData = [{
    id: 'Mock Score',
    data: last5Tests.map((test: DashboardTestAttempt, index: number) => ({
      x: `T${last5Tests.length - index}`,
      y: test.overall?.marks || 0
    })).reverse()
  }];

  const radarData = (practiceCategory?.subjects || []).map((sub: SubjectPractice, index: number) => ({
    subject: sub.subjectName || getSubjectName(sub.subjectId, index),
    Accuracy: sub.accuracy || 0
  }));

  // 🚨 FIX: Map the raw backend strings to our clean, short labels
  const typeData = (practiceCategory?.questionTypes || []).map((qt: QuestionTypeStat) => ({
    type: getShortQType(qt.questionType || 'Unknown'),
    accuracy: Math.round(qt.accuracy || 0) // Rounding for cleaner tooltip display
  }));

  const recentTestItems = last5Tests.map((test) => {
    const dateObj = new Date(test.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const pd = test.paperDetails;
    const examRawName = pd?.exam?.name || "Mock";

    let formattedExamName = examRawName.replace("_", " ");
    if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
    if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

    const year = pd?.year || "";
    const date = pd?.date || "";
    const month = pd?.month || "";
    const shift = pd?.shift ? `(${pd.shift.replace("_", " ")})` : "";

    let title = [formattedExamName, year, date, month, shift].filter(Boolean).join(" ").trim();
    if (!year && !date && !month) title = `${formattedExamName} Test`;

    return {
      id: test.testId,
      title: title,
      meta: `Score: ${test.overall?.marks}/${test.overall?.maxMarks || 300} • ${formattedDate}`,
      href: `/analytics/tests/${test.testId}`
    };
  });

  return { progress, testKpis, chapterKpis, scoreData, radarData, typeData, recentTestItems };
};