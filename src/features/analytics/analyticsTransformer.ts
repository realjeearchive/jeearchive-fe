import { AnalyticsDataPayload, LastNGroup, AllTestDetail } from "@/store/useAnalyticsStore";

// Type matching your AnalyticsHeader's TimeRange
export type TimeRange = "Last 3 Tests" | "Last 5 Tests" | "All Tests";

// The exact structure expected by your UI components
export interface TransformedAnalyticsUI {
  global: { testsTaken: number; avgScore: number; accuracy: number; consistency: number };
  graph: Array<{ x: string; y: number }>;
  radar: Array<{ subject: string; Accuracy: number }>;
  deepDive: Array<{ subject: string; avgScore: number; accuracy: number; negatives: number; avgTime: number }>;
  efficiency: { fastCorrect: number; slowCorrect: number; fastWrong: number; slowWrong: number };
  weakness: Array<{ chapter: string; subject: string; accuracy: number }>;
}

export const transformAnalyticsData = (
  data: AnalyticsDataPayload | null, 
  timeRange: TimeRange
): TransformedAnalyticsUI | null => {
  if (!data) return null;

  // 1. Select the right data block based on Time Range
  let groupData: LastNGroup | undefined;
  if (timeRange === "Last 3 Tests") {
    groupData = data.lastNTests?.last3;
  } else if (timeRange === "Last 5 Tests") {
    groupData = data.lastNTests?.last5;
  } else {
    groupData = data.report; // Usually contains 'All' or max N
  }

  if (!groupData) return null;

  const examReport = groupData.examReports?.JEE_MAIN;
  if (!examReport) return null;

  // 2. Global Stats
  const global = {
    testsTaken: examReport.totalTests || 0,
    avgScore: Math.round(examReport.overall.avgScore || 0),
    accuracy: Number((examReport.overall.avgAccuracy || 0).toFixed(1)),
    consistency: 8.5 // Backend doesn't currently provide a consistency metric, so we use a placeholder
  };

  // 3. Performance Graph
  // Reverse the array so oldest test is on the left (T1, T2, etc.)
  const reversedTests = [...(groupData.testMarksList || [])].reverse();
  const graph = reversedTests.map((t, i) => ({
    x: `T${i + 1}`,
    y: t.marks
  }));

  // 4. Subject Radar & Deep Dive Mapping
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

  // 5. Efficiency Matrix 
  // (Placeholder: Backend JSON does not currently include speed/accuracy quadrants, waiting on backend update)
  const efficiency = { fastCorrect: 0, slowCorrect: 0, fastWrong: 0, slowWrong: 0 };

  // 6. Weakness Hunter (Calculate bottom performing chapters across all tests)
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
    .filter(([_, stats]) => stats.attempt > 0) // Only count chapters they have attempted
    .map(([chapter, stats]) => ({
      chapter,
      subject: stats.subject,
      accuracy: Math.round((stats.correct / stats.attempt) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy) // Sort lowest accuracy first
    .slice(0, 4); // Take bottom 4 weaknesses

  return { global, graph, radar, deepDive, efficiency, weakness };
};