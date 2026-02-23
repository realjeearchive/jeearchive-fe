import React from 'react';
import { FiAward, FiClock, FiTarget, FiCheckSquare } from 'react-icons/fi';
import { 
  DashboardDataPayload, 
  TestAttempt, 
  SubjectPractice, 
  QuestionTypeStat 
} from '@/store/useDashboardStore';

const getSubjectName = (id: string, index: number): string => {
  const map: Record<string, string> = {
    "8c36e7ff-2ede-453a-9048-c1e101ed627e": "Physics",
    "447bd2dc-9a10-4620-81e6-d02b6d3897e2": "Chemistry",
    "34546fed-8b2d-42d8-9f18-099f16331870": "Mathematics"
  };
  const fallback = ["Physics", "Chemistry", "Mathematics"];
  return map[id] || fallback[index] || "Unknown";
};

// Takes exactly the payload type or null. No "any" wrapper needed.
export const transformDashboardData = (data: DashboardDataPayload | null) => {
  if (!data) return null;

  const { last5Tests, practice, uniqueQuestionsAttempted } = data;

  const progress = {
    phy: { 
        solved: uniqueQuestionsAttempted?.subjectWise?.Physics?.uniqueAttempted ?? 0, 
        total: uniqueQuestionsAttempted?.subjectWise?.Physics?.totalQuestions ?? 3200 
    },
    chem: { 
        solved: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.uniqueAttempted ?? 0, 
        total: uniqueQuestionsAttempted?.subjectWise?.Chemistry?.totalQuestions ?? 3200 
    },
    math: { 
        solved: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.uniqueAttempted ?? 0, 
        total: uniqueQuestionsAttempted?.subjectWise?.Mathematics?.totalQuestions ?? 3200 
    },
  };

  const kpis = [
    { 
        label: "Mock Accuracy", 
        value: practice?.overall?.accuracy ? `${practice.overall.accuracy.toFixed(1)}%` : "--", 
        sub: "Overall accuracy", 
        icon: React.createElement(FiTarget, { size: 16 }) 
    },
    { 
        label: "Avg Time", 
        value: practice?.overall?.avgTimePerQuestion ? `${Math.round(practice.overall.avgTimePerQuestion)}s` : "--", 
        sub: "Per question", 
        icon: React.createElement(FiClock, { size: 16 }) 
    },
    { 
        label: "Total Marks", 
        value: practice?.overall?.totalMarksEarned?.toString() ?? "0", 
        sub: "Earned in practice", 
        icon: React.createElement(FiAward, { size: 16 }) 
    },
    { 
        label: "Attempts", 
        value: practice?.overall?.totalAttempts?.toString() ?? "0", 
        sub: "Total questions tried", 
        icon: React.createElement(FiCheckSquare, { size: 16 }) 
    },
  ];

  const scoreData = [{
    id: 'Mock Score',
    data: (last5Tests || []).map((test: TestAttempt, index: number) => ({
      x: `Test ${index + 1}`,
      y: test.marks
    })).reverse() 
  }];

  const radarData = (practice?.subjects || []).map((sub: SubjectPractice, index: number) => ({
    subject: getSubjectName(sub.subjectId, index),
    Accuracy: sub.accuracy || 0
  }));

  const typeData = (practice?.questionTypes || []).map((qt: QuestionTypeStat) => ({
    type: qt.type || 'Unknown',
    accuracy: qt.accuracy || 0
  }));

  return { progress, kpis, scoreData, radarData, typeData };
};