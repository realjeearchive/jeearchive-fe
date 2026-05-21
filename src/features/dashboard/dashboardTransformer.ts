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

export const transformDashboardData = (data: DashboardDataPayload | null, examFilter: ExamFilter = "overall") => {
  if (!data) return null;

  const { tests, practice, uniqueQuestionsAttempted } = data;

  // Use examFilter to pick the right data
  const last5Tests = tests?.[examFilter]?.last5 || [];
  const testAggregates = tests?.[examFilter]?.aggregate;
  const practiceCategory = practice?.[examFilter];
  const practiceOverall = practiceCategory?.overall;

  // 1. Map Progress Cards (always from overall uniqueQuestionsAttempted)
  const progress = {
    phy: { solved: uniqueQuestionsAttempted?.subjectWise?.Physics?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Physics?.totalQuestions ?? 3200 },
    chem: { solved: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.totalQuestions ?? 3200 },
    math: { solved: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.totalQuestions ?? 3200 },
  };

  // --- KPI CALCULATIONS ---
  const avgTestAcc = testAggregates?.overallAccuracy ?? 0;
  const testsIncluded = testAggregates?.testsIncluded || 1;
  const avgTestScore = testAggregates?.totalMarks ? testAggregates.totalMarks / testsIncluded : 0;
  const totalMocks = testAggregates?.testsIncluded || data.totalUniqueMockTests || 0;

  // 2A. Test KPIs
  const testKpis = [
    { label: "Mock Accuracy", value: `${avgTestAcc.toFixed(1)}%`, sub: "Avg in recent tests", icon: React.createElement(FiTarget, { size: 16 }) },
    { label: "Avg Score", value: Math.round(avgTestScore).toString(), sub: "Per Test Average", icon: React.createElement(FiActivity, { size: 16 }) },
    { label: "AIR Prediction", value: "--", sub: "Take more tests to unlock", icon: React.createElement(FiAward, { size: 16 }) },
    { label: "Mocks Attempted", value: totalMocks.toString(), sub: "Total tests recorded", icon: React.createElement(FiCheckSquare, { size: 16 }) },
  ];

  // 2B. Practice KPIs
  const chapterKpis = [
    { label: "Practice Accuracy", value: practiceOverall?.accuracy ? `${practiceOverall.accuracy.toFixed(1)}%` : "--", sub: "Overall chapter accuracy", icon: React.createElement(FiCrosshair, { size: 16 }) },
    { label: "Avg Time", value: practiceOverall?.avgTimePerQuestion ? `${Math.round(practiceOverall.avgTimePerQuestion)}s` : "--", sub: "Per question", icon: React.createElement(FiClock, { size: 16 }) },
    { label: "Total Marks", value: practiceOverall?.totalMarksEarned?.toString() ?? "0", sub: "Earned in practice", icon: React.createElement(FiAward, { size: 16 }) },
    { label: "Questions Solved", value: practiceOverall?.totalAttempts?.toString() ?? "0", sub: "Total attempts made", icon: React.createElement(FiCheckSquare, { size: 16 }) },
  ];

  // 3. Map Score Growth
  const scoreData = [{
    id: 'Mock Score',
    data: last5Tests.map((test: DashboardTestAttempt, index: number) => ({
      x: `T${last5Tests.length - index}`,
      y: test.overall?.marks || 0
    })).reverse()
  }];

  // 4. Map Subject Accuracy (from practice category for selected exam)
  const radarData = (practiceCategory?.subjects || []).map((sub: SubjectPractice, index: number) => ({
    subject: sub.subjectName || getSubjectName(sub.subjectId, index),
    Accuracy: sub.accuracy || 0
  }));

  // 5. Map Question Types
  const typeData = (practiceCategory?.questionTypes || []).map((qt: QuestionTypeStat) => ({
    type: qt.questionType || 'Unknown',
    accuracy: qt.accuracy || 0
  }));

  // 6. Map Recent Tests
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