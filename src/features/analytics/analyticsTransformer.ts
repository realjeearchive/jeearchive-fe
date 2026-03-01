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
  efficiency: { fastCorrect: number; slowCorrect: number; fastWrong: number; slowWrong: number };
  weakness: Array<{ chapter: string; subject: string; accuracy: number }>;
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
    avgScore: Math.round(examReport.overall.avgScore || 0),
    accuracy: Number((examReport.overall.avgAccuracy || 0).toFixed(1)),
    consistency: 8.5 
  };

  // 🚨 FIX: Extracting from examReport instead of groupData
  const reversedTests = [...(examReport.testMarksList || [])].reverse();
  const graph = reversedTests.map((t, i) => ({
    x: `T${i + 1}`,
    y: t.marks
  }));

  const radar: Array<{ subject: string; Accuracy: number }> = [];
  const deepDive: Array<{ subject: string; avgScore: number; accuracy: number; negatives: number; avgTime: number }> = [];

  const subjectsMap = [
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'math', label: 'Mathematics' }
  ] as const;

  subjectsMap.forEach(({ key, label }) => {
    const subData = examReport.subjects[key];
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

  const efficiency = { fastCorrect: 0, slowCorrect: 0, fastWrong: 0, slowWrong: 0 };

  const chapterStats: Record<string, { subject: string; attempt: number; correct: number }> = {};

  (data.allTests || []).forEach((test: AllTestDetail) => {
    (test.chapterWise || []).forEach((ch) => {
      if (!chapterStats[ch.chapterName]) {
        chapterStats[ch.chapterName] = { subject: ch.subjectName, attempt: 0, correct: 0 };
      }
      chapterStats[ch.chapterName].attempt += ch.attempt;
      chapterStats[ch.chapterName].correct += ch.correct;
    });
  });

  const weakness = Object.entries(chapterStats)
    .filter(([_, stats]) => stats.attempt > 0) 
    .map(([chapter, stats]) => ({
      chapter,
      subject: stats.subject,
      accuracy: Math.round((stats.correct / stats.attempt) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy) 
    .slice(0, 4); 

  // 🚨 FIX: Deep fetching the recent tests list from inside examReports.JEE_MAIN
  const recentTestsSource = data.lastNTests?.last3?.examReports?.JEE_MAIN?.testMarksList || [];

  const recentTests: RecentTestUI[] = recentTestsSource.map((t) => {
    const dateObj = new Date(t.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    return {
      id: t.testId,
      title: (t.examName || "JEE_MAIN").replace("_", " ") + " Mock Test", 
      meta: `Score: ${t.marks}/${t.maxMarks} • ${formattedDate}`,
      status: "COMPLETED", 
      score: t.marks,
      totalMarks: t.maxMarks,
      date: formattedDate
    };
  });

  return { global, graph, radar, deepDive, efficiency, weakness, recentTests };
};