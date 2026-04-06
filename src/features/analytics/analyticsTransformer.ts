import { AnalyticsDataPayload, LastNGroup, AllTestDetail } from "@/store/useAnalyticsStore";

export type TimeRange = "Last 3 Tests" | "Last 5 Tests" | "All Tests";

export interface RecentTestUI {
  id: string;
  title: string;
  meta: string;
  status: "COMPLETED" | "IN_PROGRESS";
  score: number;
  totalMarks: number;
  date: string;
}

export interface TransformedAnalyticsUI {
  global: { testsTaken: number; avgScore: number; accuracy: number; consistency: number };
  graph: Array<{ x: string; y: number }>;
  radar: Array<{ subject: string; Accuracy: number }>;
  deepDive: Array<{ subject: string; avgScore: number; accuracy: number; negatives: number; avgTime: number }>;
  // 🚨 FIX: Updated Efficiency Interface to use real backend metrics
  efficiency: { mcqAcc: number; numAcc: number; leakage: number; momentum: number };
  weakness: Array<{ chapter: string; subject: string; accuracy: number; weightage?: string }>;
  recentTests: RecentTestUI[];
}

export const transformAnalyticsData = (
  data: AnalyticsDataPayload | null, 
  timeRange: TimeRange
): TransformedAnalyticsUI | null => {
  if (!data) return null;

  let groupData: LastNGroup | undefined;
  if (timeRange === "Last 3 Tests") {
    groupData = data.lastNTests?.last3;
  } else if (timeRange === "Last 5 Tests") {
    groupData = data.lastNTests?.last5;
  } else {
    groupData = data.report; 
  }

  if (!groupData) return null;

  const examReport = groupData.examReports?.JEE_MAIN;
  if (!examReport) return null;

  const global = {
    testsTaken: examReport.totalTests || 0,
    avgScore: Math.round(examReport.overall?.avgScore || 0),
    accuracy: Number((examReport.overall?.avgAccuracy || 0).toFixed(1)),
    consistency: 8.5 
  };

  const reversedTests = [...(examReport.testMarksList || [])].reverse();
  const graph = reversedTests.map((t, i) => ({
    x: `T${i + 1}`,
    y: t.marks || 0
  }));

  const radar: Array<{ subject: string; Accuracy: number }> = [];
  const deepDive: Array<{ subject: string; avgScore: number; accuracy: number; negatives: number; avgTime: number }> = [];

  const subjectsMap = [
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'math', label: 'Mathematics' }
  ] as const;

  subjectsMap.forEach(({ key, label }) => {
    const subKey = key as keyof typeof examReport.subjects;
    const subData = examReport.subjects?.[subKey];
    
    if (subData) {
      radar.push({
        subject: label,
        Accuracy: Math.round(subData.avgAccuracy || 0)
      });
      deepDive.push({
        subject: label,
        avgScore: Math.round(subData.avgScore || 0),
        accuracy: Math.round(subData.avgAccuracy || 0),
        negatives: Math.round(subData.avgWrong || 0),
        avgTime: Math.round(subData.avgTimePerQuestion || 0)
      });
    }
  });

  // 🚨 FIX: Extract Format Analytics & Trends from the Backend
  const qTypes = examReport.questionTypes || {};
  const single = qTypes.SingleCorrect || { avgCorrect: 0, avgWrong: 0 };
  const integer = qTypes.Integer || { avgCorrect: 0, avgWrong: 0 };

  const singleTotal = (single.avgCorrect || 0) + (single.avgWrong || 0);
  const singleAcc = singleTotal > 0 ? Math.round((single.avgCorrect / singleTotal) * 100) : 0;

  const intTotal = (integer.avgCorrect || 0) + (integer.avgWrong || 0);
  const intAcc = intTotal > 0 ? Math.round((integer.avgCorrect / intTotal) * 100) : 0;

  const totalNegatives = Math.round(((single.avgWrong || 0) + (integer.avgWrong || 0)) * 1); // Assuming 1 mark lost per wrong
  const momentum = Math.round(examReport.improvement?.overall?.scoreChange || 0);

  const efficiency = {
    mcqAcc: singleAcc,
    numAcc: intAcc,
    leakage: totalNegatives,
    momentum: momentum
  };

  const chapterStats: Record<string, { subject: string; attempt: number; correct: number; wrong: number }> = {};
  const relevantTestIds = new Set((examReport.testMarksList || []).map(t => t.testId));
  const testsToAnalyze = (data.allTests || []).filter(test => relevantTestIds.has(test.id));

  testsToAnalyze.forEach((test) => {
    const chapters = (test.chapterWise || []) as Array<{
      chapterName: string;
      subjectName: string;
      attempt: number;
      correct: number;
      wrong: number;
    }>;

    chapters.forEach((ch) => {
      const name = ch.chapterName || "Unknown Chapter";
      if (!chapterStats[name]) {
        chapterStats[name] = { subject: ch.subjectName || "Unknown", attempt: 0, correct: 0, wrong: 0 };
      }
      chapterStats[name].attempt += ch.attempt || 0;
      chapterStats[name].correct += ch.correct || 0;
      chapterStats[name].wrong += ch.wrong || 0;
    });
  });

  const weakness = Object.entries(chapterStats)
    .filter(([_, stats]) => stats.attempt > 0) 
    .map(([chapter, stats]) => ({
      chapter,
      subject: stats.subject,
      accuracy: Math.round((stats.correct / stats.attempt) * 100),
      weightage: stats.wrong >= 2 ? "High" : "Normal" 
    }))
    .sort((a, b) => a.accuracy - b.accuracy) 
    .slice(0, 4); 

  const recentTestsSource = examReport.testMarksList || [];
  const recentTests: RecentTestUI[] = recentTestsSource.map((t) => {
    const dateObj = new Date(t.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    const fullTestDetail = data.allTests?.find((at) => at.id === t.testId);
    
    const safeTestDetail = fullTestDetail as unknown as {
      paperMeta?: {
        year?: string | number;
        month?: string;
        date?: string;
        shift?: string;
      };
    };
    
    const pd = safeTestDetail?.paperMeta;

    const examRawName = t.examName || "JEE_MAIN";
    let formattedExamName = examRawName.replace("_", " ");
    if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
    if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

    const year = pd?.year || "";
    const date = pd?.date || "";
    const month = pd?.month || "";
    const shift = pd?.shift ? `(${pd.shift})` : "";

    let title = [formattedExamName, year, date, month, shift].filter(Boolean).join(" ").trim();
    
    if (!year && !date && !month) {
        title = `${formattedExamName} Mock Test`;
    }

    return {
      id: t.testId,
      title: title, 
      meta: `Score: ${t.marks || 0}/${t.maxMarks || 300} • ${formattedDate}`,
      status: "COMPLETED", 
      score: t.marks || 0,
      totalMarks: t.maxMarks || 300,
      date: formattedDate
    };
  });

  return { global, graph, radar, deepDive, efficiency, weakness, recentTests };
};