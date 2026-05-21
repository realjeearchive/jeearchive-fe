"use client";

import React, { useState, useEffect } from "react";
import styles from "./analyticsPage.module.css";
import AnalyticsHeader, { TimeRange, ExamTypeUI } from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

// Components
import { GlobalStats } from "@/components/analytics/Overall/GlobalStats/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList/RecentTestsList";
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive";
import { EfficiencyMatrix } from "@/components/analytics/Overall/EfficiencyMatrix/EfficiencyMatrix";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter/WeaknessHunter";
import { Loader } from "@/components/ui/loader";

import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import { transformAnalyticsData, TransformedAnalyticsUI } from "@/features/analytics/analyticsTransformer";

const DATA_EMPTY: TransformedAnalyticsUI = {
  global: { testsTaken: 0, avgScore: 0, accuracy: 0, consistency: 0 },
  graph: [],
  radar: [],
  deepDive: [],
  efficiency: { mcqAcc: 0, numAcc: 0, leakage: 0, momentum: 0 },
  weakness: [],
  recentTests: []
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 5 Tests");
  const [examType, setExamType] = useState<ExamTypeUI>("Overall");

  const { 
    rawAnalytics, 
    isLoading, 
    error, 
    setAnalyticsData, 
    setLoading, 
    setError, 
    isNewUser 
  } = useAnalyticsStore();

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

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader label="Crunching your performance data..." />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  const newUser = isNewUser();
  // Pass BOTH filters to the transformer
  const transformedData = transformAnalyticsData(rawAnalytics, timeRange, examType);
  const currentData = (newUser || !transformedData) ? DATA_EMPTY : transformedData;

  return (
    <div className={styles.pageContainer}>
      <AnalyticsHeader 
        selectedRange={timeRange} 
        onRangeChange={setTimeRange} 
        selectedExam={examType}
        onExamChange={setExamType}
      />

      <GlobalStats data={currentData.global} />

      <div className={styles.gridChartRow}>
        <div className={styles.chartSpan2}>
          <PerformanceGraph data={currentData.graph} />
        </div>
        <div>
          <SubjectRadar data={currentData.radar} />
        </div>
      </div>

      <SubjectDeepDive data={currentData.deepDive} />

      <div className={styles.gridMetricRow}>
        <div className={styles.minWidth0}>
          <EfficiencyMatrix data={currentData.efficiency} />
        </div>
        <div className={styles.minWidth0}>
          <WeaknessHunter data={currentData.weakness} />
        </div>
      </div>

      <RecentTestsList isEmpty={newUser} data={currentData.recentTests} />
    </div>
  );
}