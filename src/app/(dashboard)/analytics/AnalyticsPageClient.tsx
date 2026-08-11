"use client";

import React, { useState, useEffect } from "react";
import styles from "./analyticsPage.module.css";
import AnalyticsHeader, {
  TimeRange,
  ExamTypeUI,
} from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

import dynamic from "next/dynamic";

const GlobalStats = dynamic(() => import("@/components/analytics/Overall/GlobalStats/GlobalStats").then(mod => mod.GlobalStats));
const PerformanceGraph = dynamic(() => import("@/components/analytics/Overall/PerformanceGraph/PerformanceGraph").then(mod => mod.PerformanceGraph));
const SubjectRadar = dynamic(() => import("@/components/analytics/Overall/SubjectRadar/SubjectRadar").then(mod => mod.SubjectRadar));
const RecentTestsList = dynamic(() => import("@/components/analytics/Overall/RecentTestsList/RecentTestsList").then(mod => mod.RecentTestsList));
const SubjectDeepDive = dynamic(() => import("@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive").then(mod => mod.SubjectDeepDive));
const EfficiencyMatrix = dynamic(() => import("@/components/analytics/Overall/EfficiencyMatrix/EfficiencyMatrix").then(mod => mod.EfficiencyMatrix));
const WeaknessHunter = dynamic(() => import("@/components/analytics/Overall/WeaknessHunter/WeaknessHunter").then(mod => mod.WeaknessHunter));
import { Loader } from "@/components/ui/loader";

import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import {
  transformAnalyticsData,
  TransformedAnalyticsUI,
} from "@/features/analytics/analyticsTransformer";

import { get, set as setIdb } from "idb-keyval";

const DATA_EMPTY: TransformedAnalyticsUI = {
  global: { testsTaken: 0, avgScore: 0, accuracy: 0, avgTime: 0 },
  graph: [],
  radar: [],
  deepDive: [],
  efficiency: {
    questionTypes: [],
    leakage: 0,
    momentum: 0,
  },
  weakness: [],
  recentTests: [],
};

export function AnalyticsPageClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 5 Tests");
  const [examType, setExamType] = useState<ExamTypeUI>("Overall");
  
  // 🔥 FIX: 150ms delay state to prevent flicker before IDB cache is checked
  const [showLoader, setShowLoader] = useState(false);

  const {
    rawAnalytics,
    isLoading,
    error,
    setAnalyticsData,
    setLoading,
    setError,
    isNewUser,
  } = useAnalyticsStore();

  const { isRateLimited } = useRateLimitStore();

  const hasFetched = React.useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && !isRateLimited) {
      timer = setTimeout(() => setShowLoader(true), 150);
    } else {
      timer = setTimeout(() => setShowLoader(false), 0);
    }
    return () => clearTimeout(timer);
  }, [isLoading, isRateLimited]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      let hasCachedData = false;

      // 0. Check if it's already in the live Zustand store
      if (rawAnalytics) {
        hasCachedData = true;
      }

      // 1. Try to load from IndexedDB first if not in store
      if (!hasCachedData) {
        try {
          const cachedData = await get("analytics_cache");
          if (cachedData) {
            hasCachedData = true;
            setAnalyticsData(cachedData);
            console.info("[AnalyticsPageClient] Loaded from IDB");
          }
        } catch (e) {
          console.error("[AnalyticsPageClient] IDB get error", e);
        }
      }

      if (!hasCachedData) {
        setLoading(true);
      }

      // 2. Always fetch fresh data from API in background
      try {
        console.info("[AnalyticsPageClient] Fetching fresh data from API");
        const response = await fetchAnalyticsData();
        if (response.success && response.data) {
          setAnalyticsData(response.data);
          try {
            await setIdb("analytics_cache", response.data);
          } catch (e) {
            console.error("[AnalyticsPageClient] IDB set error", e);
          }
        } else if (!hasCachedData) {
          setError("Performance analysis metrics are unavailable right now.");
        }
      } catch (err: unknown) {
        console.error("[AnalyticsPageClient] API fetch failed:", err);
        if (!hasCachedData) {
          setError("Connection drop. Please refresh.");
        }
      }
    };

    loadAnalytics();
  }, [rawAnalytics, setAnalyticsData, setLoading, setError]);

  if (isLoading && !isRateLimited) {
    if (!showLoader) {
      // 150ms blank screen delay to allow fast IDB retrieval without flashing a spinner
      return <main className={styles.loaderContainer} aria-label="Loading analytics"></main>;
    }
    return (
      <main className={styles.loaderContainer} aria-label="Loading analytics">
        <Loader label="Crunching your performance data..." />
      </main>
    );
  }

  if (error && !isRateLimited) {
    return (
      <main className={styles.errorContainer} aria-label="Analytics error">
        <FiAlertTriangle size={32} className={styles.errorIcon} aria-hidden="true" />
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className={styles.retryButton}
          aria-label="Refresh analytics"
        >
          <FiRefreshCw size={14} aria-hidden="true" /> Try Again
        </button>
      </main>
    );
  }

  const newUser = isNewUser();
  const transformedData = transformAnalyticsData(rawAnalytics, timeRange, examType);
  const currentData = newUser || !transformedData ? DATA_EMPTY : transformedData;

  return (
    <>
      <RateLimitModal />

      <main className={styles.pageContainer} aria-label="Analytics dashboard">
        <AnalyticsHeader
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
          selectedExam={examType}
          onExamChange={setExamType}
        />

        <section aria-label="Overall statistics">
          <GlobalStats data={currentData.global} />
        </section>

        <div className={styles.gridChartRow}>
          <div className={styles.chartSpan2}>
            <PerformanceGraph data={currentData.graph} />
          </div>
          <div>
            <SubjectRadar data={currentData.radar} />
          </div>
        </div>

        <section aria-label="Subject breakdown">
          <SubjectDeepDive data={currentData.deepDive} />
        </section>

        <div className={styles.gridMetricRow}>
          <div className={styles.minWidth0}>
            <EfficiencyMatrix data={currentData.efficiency} />
          </div>
          <div className={styles.minWidth0}>
            <WeaknessHunter data={currentData.weakness} />
          </div>
        </div>

        <section aria-label="Recent test activity">
          <RecentTestsList isEmpty={newUser} data={currentData.recentTests} />
        </section>
      </main>
    </>
  );
}