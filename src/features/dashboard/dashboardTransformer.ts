import React from 'react';
import { FiAward, FiClock, FiTarget, FiCheckSquare, FiActivity, FiCrosshair } from 'react-icons/fi';
import { DashboardDataPayload, DashboardTestAttempt, SubjectPractice, QuestionTypeStat } from '@/store/useDashboardStore';

const getSubjectName = (id: string, index: number): string => {
  const map: Record<string, string> = {
    "8c36e7ff-2ede-453a-9048-c1e101ed627e": "Mathematics",
    "447bd2dc-9a10-4620-81e6-d02b6d3897e2": "Physics",
    "34546fed-8b2d-42d8-9f18-099f16331870": "Chemistry"
  };
  const fallback = ["Physics", "Chemistry", "Mathematics"];
  return map[id] || fallback[index] || "Unknown";
};

export const transformDashboardData = (data: DashboardDataPayload | null) => {
  if (!data) return null;

  const { tests, practice, uniqueQuestionsAttempted } = data;
  const last5Tests = tests?.last5 || [];

  // 1. Map Progress Cards
  const progress = {
    phy: { solved: uniqueQuestionsAttempted?.subjectWise?.Physics?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Physics?.totalQuestions ?? 3200 },
    chem: { solved: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.totalQuestions ?? 3200 },
    math: { solved: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.uniqueAttempted ?? 0, total: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.totalQuestions ?? 3200 },
  };

  // --- KPI CALCULATIONS ---
  const testCount = last5Tests.length;
  const avgTestAcc = testCount > 0 ? last5Tests.reduce((acc, t) => acc + (t.overall?.accuracy || 0), 0) / testCount : 0;
  const avgTestScore = testCount > 0 ? last5Tests.reduce((acc, t) => acc + (t.overall?.marks || 0), 0) / testCount : 0;

  // 2A. Test KPIs
  const testKpis = [
    { label: "Mock Accuracy", value: testCount > 0 ? `${avgTestAcc.toFixed(1)}%` : "--", sub: "Avg in recent tests", icon: React.createElement(FiTarget, { size: 16 }) },
    { label: "Avg Score", value: testCount > 0 ? Math.round(avgTestScore).toString() : "--", sub: "Out of 300", icon: React.createElement(FiActivity, { size: 16 }) },
    { label: "AIR Prediction", value: "--", sub: "Take more tests to unlock", icon: React.createElement(FiAward, { size: 16 }) },
    { label: "Mocks Attempted", value: testCount.toString(), sub: "Recent tests recorded", icon: React.createElement(FiCheckSquare, { size: 16 }) },
  ];

  // 2B. Practice KPIs
  const chapterKpis = [
    { label: "Practice Accuracy", value: practice?.overall?.accuracy ? `${practice.overall.accuracy.toFixed(1)}%` : "--", sub: "Overall chapter accuracy", icon: React.createElement(FiCrosshair, { size: 16 }) },
    { label: "Avg Time", value: practice?.overall?.avgTimePerQuestion ? `${Math.round(practice.overall.avgTimePerQuestion)}s` : "--", sub: "Per question", icon: React.createElement(FiClock, { size: 16 }) },
    { label: "Total Marks", value: practice?.overall?.totalMarksEarned?.toString() ?? "0", sub: "Earned in practice", icon: React.createElement(FiAward, { size: 16 }) },
    { label: "Questions Solved", value: practice?.overall?.totalAttempts?.toString() ?? "0", sub: "Total attempts made", icon: React.createElement(FiCheckSquare, { size: 16 }) },
  ];

  // 3. Map Score Growth
  const scoreData = [{
    id: 'Mock Score',
    data: last5Tests.map((test: DashboardTestAttempt, index: number) => ({
      x: `Test ${index + 1}`,
      y: test.overall?.marks || 0
    })).reverse() 
  }];

  // 4. Map Subject Accuracy 
  const radarData = (practice?.subjects || []).map((sub: SubjectPractice, index: number) => ({
    subject: sub.subjectName || getSubjectName(sub.subjectId, index),
    Accuracy: sub.accuracy || 0
  }));

  // 5. Map Question Types 
  const typeData = (practice?.questionTypes || []).map((qt: QuestionTypeStat) => ({
    type: qt.questionType || 'Unknown',
    accuracy: qt.accuracy || 0
  }));

  // 6. Map Recent Tests perfectly for the UI List Component
  const recentTestItems = last5Tests.map((test) => {
    const dateObj = new Date(test.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    // --- 🚨 FIX: STRICT TYPING INSTEAD OF 'any' ---
    const pd = test.paperDetails as {
      exam?: { name: string };
      year?: number | string;
      date?: string;
      month?: string;
      shift?: string;
    } | undefined;
    
    const examRawName = pd?.exam?.name || "Mock";
    
    // Clean up exam name formatting
    let formattedExamName = examRawName.replace("_", " ");
    if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
    if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

    // Grab detailed components safely
    const year = pd?.year || "";
    const date = pd?.date || "";
    const month = pd?.month || "";
    const shift = pd?.shift ? `(${pd.shift})` : "";

    // Combine them intelligently
    let title = [formattedExamName, year, date, month, shift].filter(Boolean).join(" ").trim();
    
    // If paper details are missing entirely, fallback safely
    if (!year && !date && !month) {
        title = `${formattedExamName} Test`;
    }

    return {
        id: test.testId,
        title: title, 
        meta: `Score: ${test.overall?.marks}/${test.overall?.maxMarks || 300} • ${formattedDate}`,
        href: `/analytics/tests/${test.testId}`
    };
  });

  return { progress, testKpis, chapterKpis, scoreData, radarData, typeData, recentTestItems };
};