"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./analysis.module.css";
import { AnalysisLayout } from "@/components/analytics/TestAnalysis/AnalysisLayout";
import { FiDownload, FiBookOpen } from "react-icons/fi";
import { Loader } from "@/components/ui/loader";

// Stores & API
import { useAnalyticsStore, AnalyticsDataPayload, AllTestDetail } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import { useSingleTestStore } from "@/store/useSingleTestStore";

interface PageProps {
  params: Promise<{ testId: string }>;
}

// Helper function to find a test across all exam categories
const findTestById = (
  rawAnalytics: AnalyticsDataPayload | null,
  testId: string
): AllTestDetail | null => {
  if (!rawAnalytics) return null;
  
  // Check in overall tests
  if (rawAnalytics.overall?.allTests) {
    const found = rawAnalytics.overall.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }
  
  // Check in JEE Main tests
  if (rawAnalytics.jeeMain?.allTests) {
    const found = rawAnalytics.jeeMain.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }
  
  // Check in JEE Advanced tests
  if (rawAnalytics.jeeAdvanced?.allTests) {
    const found = rawAnalytics.jeeAdvanced.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }
  
  return null;
};

export default function SingleTestAnalysisPage(props: PageProps) {
  const { testId } = use(props.params);
  const router = useRouter();

  const { rawAnalytics, setAnalyticsData } = useAnalyticsStore();
  const { data, isLoading, error, fetchData, clearData } = useSingleTestStore();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        let currentGlobalData = rawAnalytics;

        if (!currentGlobalData) {
          const globalRes = await fetchAnalyticsData();
          if (globalRes.success && globalRes.data) {
            setAnalyticsData(globalRes.data);
            currentGlobalData = globalRes.data;
          } else {
            setLocalError("Performance metrics unavailable.");
            return;
          }
        }

        // Find the test using the helper function
        const testDetail = findTestById(currentGlobalData, testId);

        if (!testDetail) {
          setLocalError("Test history data not found.");
          return;
        }

        await fetchData(testId, testDetail.created_at);
      } catch (err: unknown) {
        console.error("[SingleTestAnalysis] Data process failure:", err);
        setLocalError("Connection drop. Please refresh.");
      }
    };

    loadTestData();

    return () => clearData();
  }, [testId, rawAnalytics, setAnalyticsData, fetchData, clearData]);

  if (isLoading && !error && !localError) {
    return (
      <div className={styles.loaderContainer}>
        <Loader label="Crunching detailed test performance..." />
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <p className={styles.errorMessage}>
            {error || localError}
          </p>
          <p className={styles.errorSubtext}>
            This could be due to network issues or missing data.
          </p>
        </div>
        <button 
          onClick={() => router.push('/analytics')} 
          className={styles.backButton}
        >
          Back to Analytics
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Find test context for displaying header info
  const testContext = findTestById(rawAnalytics, testId);
  const dateObj = testContext ? new Date(testContext.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });

  const paperMeta = testContext?.paperMeta;
  const examRawName = testContext?.exam || "JEE_MAIN";
  
  let formattedExamName = examRawName.replace("_", " ");
  if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
  if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

  const year = paperMeta?.year || "";
  const month = paperMeta?.month || "";
  const shift = paperMeta?.shift ? `(${paperMeta.shift})` : "";

  let testName = [formattedExamName, year, month, shift].filter(Boolean).join(" ").trim();
  
  if (!year && !month) {
    testName = `${formattedExamName} Mock Test`;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerRow}>
          <div className={styles.testInfo}>
              <h1 className={styles.title}>{testName}</h1>
              <p className={styles.meta}>
                <span>{formattedDate}</span>
                <span className={styles.dot}></span>
                <span>Full Test</span>
              </p>
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <AnalysisLayout />
      </div>

      <div className={styles.footerActions}>
        <button className={`${styles.btn} ${styles.reportBtn}`}>
          <FiDownload size={14} /> Report
        </button>
        
        <button 
          className={`${styles.btn} ${styles.solutionsBtn}`}
          onClick={() => router.push(`/solutions/${testId}`)}
        >
          <FiBookOpen size={14} /> View Solutions
        </button>
      </div>
    </div>
  );
}