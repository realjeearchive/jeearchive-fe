"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./analysis.module.css";
import dynamic from "next/dynamic";

const AnalysisLayout = dynamic(() => import("@/components/analytics/TestAnalysis/AnalysisLayout").then(mod => mod.AnalysisLayout));
import { FiDownload, FiBookOpen, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { Loader } from "@/components/ui/loader";

import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";

import { useAnalyticsStore, AnalyticsDataPayload, AllTestDetail } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import { useSingleTestStore } from "@/store/useSingleTestStore";

interface SingleTestAnalysisClientProps {
  testId: string;
}

const findTestById = (
  rawAnalytics: AnalyticsDataPayload | null,
  testId: string
): AllTestDetail | null => {
  if (!rawAnalytics) return null;

  if (rawAnalytics.overall?.allTests) {
    const found = rawAnalytics.overall.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }

  if (rawAnalytics.jeeMain?.allTests) {
    const found = rawAnalytics.jeeMain.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }

  if (rawAnalytics.jeeAdvanced?.allTests) {
    const found = rawAnalytics.jeeAdvanced.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }

  return null;
};

export function SingleTestAnalysisClient({ testId }: SingleTestAnalysisClientProps) {
  const router = useRouter();

  const { rawAnalytics, setAnalyticsData, isLoading: isGlobalLoading } = useAnalyticsStore();
  const { data, isLoading: isTestLoading, error, fetchData, clearData } = useSingleTestStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFetchingGlobal, setIsFetchingGlobal] = useState(false);

  const { isRateLimited } = useRateLimitStore();

  useEffect(() => {
    let isMounted = true;

    const loadTestData = async () => {
      setLocalError(null);

      try {
        let currentGlobalData = rawAnalytics;

        if (!currentGlobalData) {
          setIsFetchingGlobal(true);
          const globalRes = await fetchAnalyticsData();

          if (!isMounted) return;

          if (globalRes.success && globalRes.data) {
            setAnalyticsData(globalRes.data);
            currentGlobalData = globalRes.data;
          } else {
            if (!useRateLimitStore.getState().isRateLimited) {
              setLocalError("Failed to load analytics data. Please try again.");
            }
            return;
          }
        }

        const testDetail = findTestById(currentGlobalData, testId);

        if (!testDetail) {
          setLocalError("Test not found. It may have been removed.");
          return;
        }

        setIsFetchingGlobal(false);
        await fetchData(testId, testDetail.created_at);
      } catch (err: unknown) {
        if (!isMounted) return;

        console.error("[SingleTestAnalysis] Error:", err);

        if (!useRateLimitStore.getState().isRateLimited) {
          setLocalError("Connection drop. Please check your internet and refresh.");
        }
      } finally {
        if (isMounted) {
          setIsFetchingGlobal(false);
        }
      }
    };

    if (testId) loadTestData();

    return () => {
      isMounted = false;
      clearData();
    };
  }, [testId]);

  const isLoading = isGlobalLoading || isTestLoading || isFetchingGlobal;

  if (isLoading && !isRateLimited) {
    return (
      <main className={styles.loaderContainer} aria-label="Loading test analysis">
        <Loader
          label={
            isFetchingGlobal
              ? "Loading analytics data..."
              : "Crunching detailed test performance..."
          }
        />
      </main>
    );
  }

  if ((error || localError) && !isRateLimited) {
    return (
      <main className={styles.errorContainer} aria-label="Analysis error">
        <FiAlertTriangle size={32} className={styles.errorIcon} aria-hidden="true" />
        <div className={styles.errorTitle} role="alert">
          {error || localError}
        </div>
        <p className={styles.errorSubtext}>
          This could be due to network issues or missing data.
        </p>
        <div className={styles.errorActions}>
          <button
            onClick={() => router.push("/analytics")}
            className={styles.errorBackButton}
            aria-label="Back to analytics"
          >
            Back to Analytics
          </button>
          <button
            onClick={() => window.location.reload()}
            className={styles.errorRefreshButton}
            aria-label="Refresh page"
          >
            <FiRefreshCw size={14} aria-hidden="true" /> Refresh
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return <RateLimitModal />;
  }

  const testContext = findTestById(rawAnalytics, testId);
  const dateObj = testContext ? new Date(testContext.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
    <>
      <RateLimitModal />

      <main className={styles.pageContainer} aria-label={`Analysis for ${testName}`}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerRow}>
            <div className={styles.testInfo}>
              <h1 className={styles.title}>{testName}</h1>
              <p className={styles.meta}>
                <span>{formattedDate}</span>
                <span className={styles.dot} aria-hidden="true"></span>
                <span>Full Test</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contentLayout}>
          <AnalysisLayout />
        </div>

        <div className={styles.footerActions}>
          <button className={`${styles.btn} ${styles.reportBtn}`} aria-label="Download report">
            <FiDownload size={14} aria-hidden="true" /> Report
          </button>

          <button
            className={`${styles.btn} ${styles.solutionsBtn}`}
            onClick={() => router.push(`/solutions/${testId}`)}
            aria-label="View solutions for this test"
          >
            <FiBookOpen size={14} aria-hidden="true" /> View Solutions
          </button>
        </div>
      </main>
    </>
  );
}