import {
  AnalyticsDataPayload,
  TestReport,
  WeakChapter,
} from "@/store/useAnalyticsStore";
import {
  TimeRange,
  ExamTypeUI,
} from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

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
  global: {
    testsTaken: number;
    avgScore: number;
    accuracy: number;
    consistency: number;
  };
  graph: Array<{ x: string; y: number }>;
  radar: Array<{ subject: string; Accuracy: number }>;
  deepDive: Array<{
    subject: string;
    avgScore: number;
    accuracy: number;
    negatives: number;
    avgTime: number;
  }>;
  efficiency: {
    mcqAcc: number;
    numAcc: number;
    leakage: number;
    momentum: number;
  };
  weakness: Array<{
    chapter: string;
    subject: string;
    accuracy: number;
    weightage?: string;
    totalMax: number;
  }>;
  recentTests: RecentTestUI[];
}

// Maps UI string to JSON property key
const getExamKey = (
  examUI: ExamTypeUI,
): "overall" | "jeeMain" | "jeeAdvanced" => {
  if (examUI === "JEE Main") return "jeeMain";
  if (examUI === "JEE Advanced") return "jeeAdvanced";
  return "overall";
};

// Extractor for Time Range
const getTestReport = (
  data: AnalyticsDataPayload,
  examKey: "overall" | "jeeMain" | "jeeAdvanced",
  timeRange: TimeRange,
): TestReport | null => {
  const examData = data[examKey];
  if (!examData) return null;

  if (timeRange === "Last 3 Tests") return examData.testReports?.last3 || null;
  if (timeRange === "Last 5 Tests") return examData.testReports?.last5 || null;
  return examData.testReports?.all || null;
};

export const transformAnalyticsData = (
  data: AnalyticsDataPayload | null,
  timeRange: TimeRange,
  examType: ExamTypeUI,
): TransformedAnalyticsUI | null => {
  if (!data) return null;

  const examKey = getExamKey(examType);
  const testReport = getTestReport(data, examKey, timeRange);
  if (!testReport) return null;

  // 1. GLOBAL STATS
  const global = {
    testsTaken: testReport.totalTests || 0,
    avgScore: Math.round(testReport.overall?.avgScore || 0),
    accuracy: Number((testReport.overall?.avgAccuracy || 0).toFixed(1)),
    consistency: 8.5,
  };

  // 2. PERFORMANCE GRAPH
  const reversedTests = [...(testReport.testMarksList || [])].reverse();
  const graph = reversedTests.map((t, i) => ({
    x: `T${i + 1}`,
    y: t.marks || 0,
  }));

  // 3. RADAR & DEEP DIVE
  const radar: Array<{ subject: string; Accuracy: number }> = [];
  const deepDive: Array<{
    subject: string;
    avgScore: number;
    accuracy: number;
    negatives: number;
    avgTime: number;
  }> = [];

  const subjectsMap = [
    { key: "math", label: "Mathematics" },
    { key: "physics", label: "Physics" },
    { key: "chemistry", label: "Chemistry" },
  ] as const;

  subjectsMap.forEach(({ key, label }) => {
    const subData = testReport.subjects?.[key];
    if (subData) {
      radar.push({
        subject: label,
        Accuracy: Math.round(subData.avgAccuracy || 0),
      });
      deepDive.push({
        subject: label,
        avgScore: Math.round(subData.avgScore || 0),
        accuracy: Math.round(subData.avgAccuracy || 0),
        negatives: Math.round(subData.avgWrong || 0),
        avgTime: Number((subData.avgTimePerQuestion || 0).toFixed(1)),
      });
    }
  });

  // 4. EFFICIENCY MATRIX
  const qTypes = testReport.questionTypes || {};
  const singleCorrect = qTypes.SingleCorrect || { avgCorrect: 0, avgWrong: 0 };
  const singleTotal =
    (singleCorrect.avgCorrect || 0) + (singleCorrect.avgWrong || 0);
  const mcqAcc =
    singleTotal > 0
      ? Math.round((singleCorrect.avgCorrect / singleTotal) * 100)
      : 0;

  const integer = qTypes.Integer || { avgCorrect: 0, avgWrong: 0 };
  const intTotal = (integer.avgCorrect || 0) + (integer.avgWrong || 0);
  const numAcc =
    intTotal > 0 ? Math.round((integer.avgCorrect / intTotal) * 100) : 0;

  const totalNegatives = Math.round(
    (singleCorrect.avgWrong || 0) + (integer.avgWrong || 0),
  );
  const momentum = Math.round(
    testReport.improvement?.overall?.scoreChange || 0,
  );

  const efficiency = { mcqAcc, numAcc, leakage: totalNegatives, momentum };

// 5. WEAKNESS HUNTER
const weakness: Array<{
  chapter: string;
  subject: string;
  accuracy: number;
  weightage?: string;
  totalMax: number;
}> = [];

const weakChapters = data[examKey]?.weakChapters;

if (weakChapters) {
  (Object.keys(weakChapters) as Array<keyof typeof weakChapters>).forEach(
    (subject) => {
      const chapters = weakChapters[subject];
      if (Array.isArray(chapters)) {
        chapters.forEach((ch: WeakChapter) => {
          weakness.push({
            chapter: ch.chapterName,
            subject: String(subject),
            accuracy: Math.round(ch.accuracy || 0),
            totalMax: ch.totalMax || 10,
            weightage: (ch.totalMax || 10) > 50 ? "High" : "Normal",
          });
        });
      }
    },
  );
}

  // 6. RECENT TESTS
  const recentTests: RecentTestUI[] = (testReport.testMarksList || []).map(
    (t) => {
      const dateObj = new Date(t.createdAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const fullTestDetail = data[examKey]?.allTests?.find(
        (at) => at.id === t.testId,
      );
      const paperMeta = fullTestDetail?.paperMeta;

      const examRawName = t.examName || "JEE_MAIN";
      const formattedExamName =
        examRawName === "JEE_MAIN"
          ? "JEE Main"
          : examRawName === "JEE_ADVANCED"
            ? "JEE Advanced"
            : examRawName.replace("_", " ");

      const year = paperMeta?.year || "";
      const month = paperMeta?.month || "";
      const shift = paperMeta?.shift ? `(${paperMeta.shift})` : "";

      let title = [formattedExamName, year, month, shift]
        .filter(Boolean)
        .join(" ")
        .trim();
      if (!year && !month) title = `${formattedExamName} Mock Test`;

      return {
        id: t.testId,
        title: title,
        meta: `Score: ${t.marks || 0}/${t.maxMarks || 300} • ${formattedDate}`,
        status: "COMPLETED",
        score: t.marks || 0,
        totalMarks: t.maxMarks || 300,
        date: formattedDate,
      };
    },
  );

  return { global, graph, radar, deepDive, efficiency, weakness, recentTests };
};
