import { AnalyticsDataPayload, TestReport, AllTestDetail } from "@/store/useAnalyticsStore";

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
  efficiency: { mcqAcc: number; numAcc: number; leakage: number; momentum: number };
  weakness: Array<{ chapter: string; subject: string; accuracy: number; weightage?: string }>;
  recentTests: RecentTestUI[];
}

// Helper to get the appropriate test report based on time range
const getTestReport = (
  data: AnalyticsDataPayload,
  timeRange: TimeRange
): TestReport | null => {
  // Use overall analytics (combines both JEE Main & Advanced)
  const examData = data.overall;
  
  if (!examData) return null;

  if (timeRange === "Last 3 Tests") {
    return examData.testReports?.last3 || null;
  } else if (timeRange === "Last 5 Tests") {
    return examData.testReports?.last5 || null;
  } else {
    return examData.testReports?.all || null;
  }
};

// Helper to get all tests for weakness calculation
const getAllTestsForWeakness = (data: AnalyticsDataPayload): AllTestDetail[] => {
  // Combine tests from overall, jeeMain, and jeeAdvanced
  const allTests: AllTestDetail[] = [];
  
  if (data.overall?.allTests) {
    allTests.push(...data.overall.allTests);
  }
  if (data.jeeMain?.allTests) {
    allTests.push(...data.jeeMain.allTests);
  }
  if (data.jeeAdvanced?.allTests) {
    allTests.push(...data.jeeAdvanced.allTests);
  }
  
  // Remove duplicates by id
  const uniqueTests = new Map();
  allTests.forEach(test => {
    if (!uniqueTests.has(test.id)) {
      uniqueTests.set(test.id, test);
    }
  });
  
  return Array.from(uniqueTests.values());
};

export const transformAnalyticsData = (
  data: AnalyticsDataPayload | null,
  timeRange: TimeRange
): TransformedAnalyticsUI | null => {
  if (!data) return null;

  const testReport = getTestReport(data, timeRange);
  if (!testReport) return null;

  // ==========================================
  // 1. GLOBAL STATS
  // ==========================================
  const global = {
    testsTaken: testReport.totalTests || 0,
    avgScore: Math.round(testReport.overall?.avgScore || 0),
    accuracy: Number((testReport.overall?.avgAccuracy || 0).toFixed(1)),
    consistency: 8.5, // Keep as is for now (could be calculated from improvement data)
  };

  // ==========================================
  // 2. PERFORMANCE GRAPH
  // ==========================================
  const reversedTests = [...(testReport.testMarksList || [])].reverse();
  const graph = reversedTests.map((t, i) => ({
    x: `T${i + 1}`,
    y: t.marks || 0
  }));

  // ==========================================
  // 3. RADAR CHART (Subject-wise Accuracy)
  // ==========================================
  const radar: Array<{ subject: string; Accuracy: number }> = [];
  const deepDive: Array<{ subject: string; avgScore: number; accuracy: number; negatives: number; avgTime: number }> = [];

  const subjectsMap = [
    { key: 'math', label: 'Mathematics' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' }
  ] as const;

  subjectsMap.forEach(({ key, label }) => {
    const subData = testReport.subjects?.[key];
    
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

  // ==========================================
  // 4. EFFICIENCY MATRIX
  // ==========================================
  const qTypes = testReport.questionTypes || {};
  
  // Single Correct (MCQ) Accuracy
  const singleCorrect = qTypes.SingleCorrect || { avgCorrect: 0, avgWrong: 0 };
  const singleTotal = (singleCorrect.avgCorrect || 0) + (singleCorrect.avgWrong || 0);
  const mcqAcc = singleTotal > 0 ? Math.round((singleCorrect.avgCorrect / singleTotal) * 100) : 0;
  
  // Integer Type (Numerical) Accuracy
  const integer = qTypes.Integer || { avgCorrect: 0, avgWrong: 0 };
  const intTotal = (integer.avgCorrect || 0) + (integer.avgWrong || 0);
  const numAcc = intTotal > 0 ? Math.round((integer.avgCorrect / intTotal) * 100) : 0;
  
  // Leakage (Negative marks)
  const totalNegatives = Math.round((singleCorrect.avgWrong || 0) + (integer.avgWrong || 0));
  
  // Momentum (Score improvement)
  const momentum = Math.round(testReport.improvement?.overall?.scoreChange || 0);

  const efficiency = {
    mcqAcc: mcqAcc,
    numAcc: numAcc,
    leakage: totalNegatives,
    momentum: momentum
  };

 // ==========================================
// 5. WEAKNESS HUNTER (Using weakChapters from backend)
// ==========================================
const weakness: Array<{ chapter: string; subject: string; accuracy: number; weightage?: string }> = [];

// Use weakChapters from the overall analytics
const weakChapters = data.overall?.weakChapters;

if (weakChapters) {
  // Type assertion for weakChapters structure
  type WeakChapterItem = {
    chapterId: string;
    chapterName: string;
    percentage: number;
    accuracy: number;
    totalAttempts: number;
    totalMarks: number;
    totalMax: number;
  };
  
  type WeakChaptersMap = {
    Mathematics: WeakChapterItem[];
    Physics: WeakChapterItem[];
    Chemistry: WeakChapterItem[];
  };
  
  const typedWeakChapters = weakChapters as WeakChaptersMap;
  
  // Combine all subjects' weak chapters
  const allWeakChapters: Array<{ chapter: string; subject: string; accuracy: number; totalMax: number }> = [];
  
  Object.entries(typedWeakChapters).forEach(([subject, chapters]) => {
    chapters.forEach((chapter: WeakChapterItem) => {
      allWeakChapters.push({
        chapter: chapter.chapterName,
        subject: subject,
        accuracy: Math.round(chapter.accuracy || 0),
        totalMax: chapter.totalMax
      });
    });
  });
  
  // Sort by accuracy (lowest first - biggest weakness)
  // and take top 4
  allWeakChapters
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4)
    .forEach((item) => {
      weakness.push({
        chapter: item.chapter,
        subject: item.subject,
        accuracy: item.accuracy,
        weightage: item.totalMax > 50 ? "High" : "Normal"
      });
    });
}

// If no weak chapters from backend, fallback to calculating from test data
if (weakness.length === 0) {
  // Fallback logic (kept as is from before)
  const allTests = getAllTestsForWeakness(data);
  const relevantTestIds = new Set((testReport.testMarksList || []).map(t => t.testId));
  const testsToAnalyze = allTests.filter(test => relevantTestIds.has(test.id));
  
  // Additional fallback logic would go here if needed
}

  // ==========================================
  // 6. RECENT TESTS LIST
  // ==========================================
  const recentTestsSource = testReport.testMarksList || [];
  const recentTests: RecentTestUI[] = recentTestsSource.map((t) => {
    const dateObj = new Date(t.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
    
    // Find the full test details to get paper meta
    const fullTestDetail = data.overall?.allTests?.find((at) => at.id === t.testId) ||
                          data.jeeMain?.allTests?.find((at) => at.id === t.testId) ||
                          data.jeeAdvanced?.allTests?.find((at) => at.id === t.testId);
    
    const paperMeta = fullTestDetail?.paperMeta;
    
    const examRawName = t.examName || "JEE_MAIN";
    let formattedExamName = examRawName.replace("_", " ");
    if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
    if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";
    
    const year = paperMeta?.year || "";
    const month = paperMeta?.month || "";
    const shift = paperMeta?.shift ? `(${paperMeta.shift})` : "";
    
    let title = [formattedExamName, year, month, shift].filter(Boolean).join(" ").trim();
    
    if (!year && !month) {
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

  return {
    global,
    graph,
    radar,
    deepDive,
    efficiency,
    weakness,
    recentTests
  };
};