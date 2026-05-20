"use client";

import React, { useState, useEffect } from "react";
import AnalyticsHeader, { TimeRange } from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

// Components
import { GlobalStats } from "@/components/analytics/Overall/GlobalStats/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList/RecentTestsList";
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive";
import { EfficiencyMatrix } from "@/components/analytics/Overall/EfficiencyMatrix/EfficiencyMatrix";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter/WeaknessHunter";
import { Loader } from "@/components/ui/loader";

// Store & Logic
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
          console.info("[Analytics] Overall history analytics compiled successfully.");
          setAnalyticsData(response.data);
        } else {
          setError("Performance analysis metrics are unavailable right now.");
        }
      } catch (err: unknown) {
        console.error("[Analytics] History fetch failed:", err);
        setError("Connection drop. Please refresh.");
      }
    };

    if (!rawAnalytics) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [rawAnalytics, setAnalyticsData, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader label="Crunching your performance data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  const newUser = isNewUser();
  const transformedData = transformAnalyticsData(rawAnalytics, timeRange);
  const currentData = (newUser || !transformedData) ? DATA_EMPTY : transformedData;

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen">
      <AnalyticsHeader 
        selectedRange={timeRange} 
        onRangeChange={setTimeRange} 
      />

      <GlobalStats data={currentData.global} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-[16px]">
        <div className="lg:col-span-2">
          <PerformanceGraph data={currentData.graph} />
        </div>
        <div className="lg:col-span-1">
          <SubjectRadar data={currentData.radar} />
        </div>
      </div>

      <SubjectDeepDive data={currentData.deepDive} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-[16px]">
        <div className="min-w-0">
          <EfficiencyMatrix data={currentData.efficiency} />
        </div>
        <div className="min-w-0">
          <WeaknessHunter data={currentData.weakness} />
        </div>
      </div>

      <RecentTestsList isEmpty={newUser} data={currentData.recentTests} />
    </div>
  );
}