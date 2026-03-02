"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./analysis.module.css";
import { AnalysisLayout } from "@/components/analytics/TestAnalysis/AnalysisLayout";
import { FiDownload, FiBookOpen } from "react-icons/fi";

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

  // Zustand Stores
  const { rawAnalytics, setAnalyticsData } = useAnalyticsStore();
  const { data, isLoading, error, fetchData, clearData } = useSingleTestStore();
  
  // Local state for missing test errors
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        let currentGlobalData = rawAnalytics;

        // 1. Handle Hard Refresh: If global data isn't in store, fetch it first
        if (!currentGlobalData) {
          const globalRes = await fetchAnalyticsData();
          if (globalRes.success && globalRes.data) {
            setAnalyticsData(globalRes.data);
            currentGlobalData = globalRes.data;
          } else {
            setLocalError("Failed to load global test data.");
            return;
          }
        }

        // 2. Find the test to get its 'created_at' timestamp
        const testDetail = currentGlobalData?.allTests?.find((t) => t.id === testId);

        if (!testDetail) {
          setLocalError("Test not found in your history.");
          return;
        }

        // 3. Fetch the detailed single test analytics
        await fetchData(testId, testDetail.created_at);
        
      } catch (err: unknown) {
        console.error(err);
        setLocalError("An error occurred while loading the test.");
      }
    };

    loadTestData();

    // Cleanup when leaving the page so the next test doesn't flash the old data
    return () => clearData();
  }, [testId, rawAnalytics, setAnalyticsData, fetchData, clearData]);

  // --- LOADING STATE ---
  if (isLoading && !error && !localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#a1a1aa] text-sm">
        <div className="w-10 h-10 border-4 border-[#f59e0b33] border-t-[#f59e0b] rounded-full animate-spin mb-4"></div>
        <p>Crunching detailed test performance...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500 text-sm gap-4">
        <p>Error: {error || localError}</p>
        <button 
          onClick={() => router.push('/analytics')} 
          className="px-4 py-2 bg-[#211f1c] border border-[#f59e0b] text-[#f59e0b] rounded-md transition hover:bg-[#f59e0b] hover:text-white"
        >
          Back to Analytics
        </button>
      </div>
    );
  }

  // Safeguard
  if (!data) return null;

  // --- EXTRACT HEADER METADATA ---
  const testContext = rawAnalytics?.allTests?.find((t) => t.id === testId);
  const dateObj = testContext ? new Date(testContext.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const testName = testContext?.exam ? `${testContext.exam.replace("_", " ")} Mock Test` : "Mock Test";

  return (
    <div className={styles.pageContainer}>
      
      {/* HEADER ROW */}
      <div className={styles.headerWrapper}>
        <div className={styles.headerRow}>
          {/* Left: Test Info */}
          <div className={styles.testInfo}>
            <h1 className={styles.title}>
              {testName}
            </h1>
            <p className={styles.meta}>
              <span>{formattedDate}</span>
              <span className={styles.dot}></span>
              <span>Full Test</span>
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <div className={styles.contentLayout}>
        <AnalysisLayout />
      </div>

      {/* FOOTER ACTIONS */}
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