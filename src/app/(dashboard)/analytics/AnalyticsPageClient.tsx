"use client";

import React, { useState, useEffect } from "react";
import styles from "./analyticsPage.module.css";
import AnalyticsHeader, {
  TimeRange,
  ExamTypeUI,
} from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

import { GlobalStats } from "@/components/analytics/Overall/GlobalStats/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList/RecentTestsList";
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive";
import { EfficiencyMatrix } from "@/components/analytics/Overall/EfficiencyMatrix/EfficiencyMatrix";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter/WeaknessHunter";
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

const DATA_EMPTY: TransformedAnalyticsUI = {
  global: { testsTaken: 0, avgScore: 0, accuracy: 0, consistency: 0 },
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

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetchAnalyticsData();
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          setError("Performance analysis metrics are unavailable right now.");
        }
      } catch (err: unknown) {
        setError("Connection drop. Please refresh.");
      }
    };

    if (!rawAnalytics) loadAnalytics();
    else setLoading(false);
  }, [rawAnalytics, setAnalyticsData, setLoading, setError]);

  if (isLoading && !isRateLimited) {
    return (
      <main className={styles.loaderContainer} aria-label="Loading analytics">
        <Loader label="Crunching your performance data..." />
      </main>
    );
  }

  if (error && !isRateLimited) {
    return (
      <main
        className={styles.errorContainer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          gap: "16px",
        }}
        aria-label="Analytics error"
      >
        <FiAlertTriangle size={32} color="#ef4444" aria-hidden="true" />
        <div
          style={{
            color: "var(--dashboard-primary-text-color)",
            fontSize: "16px",
            fontWeight: 500,
          }}
          role="alert"
        >
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "var(--dashboard-core-color)",
            color: "#000",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
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