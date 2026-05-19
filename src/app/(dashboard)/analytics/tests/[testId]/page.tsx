"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./analysis.module.css";
import { AnalysisLayout } from "@/components/analytics/TestAnalysis/AnalysisLayout";
import { FiDownload, FiBookOpen } from "react-icons/fi";
import { Loader } from "@/components/ui/loader"; // 🔥 UNIFIED LOADER IMPORT

// Stores & API
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import { useSingleTestStore } from "@/store/useSingleTestStore";

interface PageProps {
  params: Promise<{ testId: string }>;
}

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

        const testDetail = currentGlobalData?.allTests?.find((t) => t.id === testId);

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

  // 🔥 FIXED: Standardized loader animation implementation
  if (isLoading && !error && !localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader label="Crunching detailed test performance..." />
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 text-sm font-medium gap-4">
        <p>{error || localError}</p>
        <button 
          onClick={() => router.push('/analytics')} 
          className="px-4 py-2 bg-[#211f1c] border border-[#f59e0b] text-[#f59e0b] rounded-md transition hover:bg-[#f59e0b] hover:text-white text-xs font-semibold"
        >
          Back to Analytics
        </button>
      </div>
    );
  }

  if (!data) return null;

  const testContext = rawAnalytics?.allTests?.find((t) => t.id === testId);
  const dateObj = testContext ? new Date(testContext.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const safeTestContext = testContext as unknown as {
    exam?: string;
    paperMeta?: {
      year?: string | number;
      month?: string;
      date?: string;
      shift?: string;
    };
  };

  const pd = safeTestContext?.paperMeta;
  const examRawName = safeTestContext?.exam || "JEE_MAIN";
  
  let formattedExamName = examRawName.replace("_", " ");
  if (examRawName === "JEE_MAIN") formattedExamName = "JEE Main";
  if (examRawName === "JEE_ADVANCED") formattedExamName = "JEE Advanced";

  const year = pd?.year || "";
  const date = pd?.date || "";
  const month = pd?.month || "";
  const shift = pd?.shift ? `(${pd.shift})` : "";

  let testName = [formattedExamName, year, date, month, shift].filter(Boolean).join(" ").trim();
  
  if (!year && !date && !month) {
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