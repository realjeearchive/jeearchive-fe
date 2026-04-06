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

// Store & Logic
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { fetchAnalyticsData } from "@/features/analytics/api";
import { transformAnalyticsData, TransformedAnalyticsUI } from "@/features/analytics/analyticsTransformer";

// --- FALLBACK DATA FOR NEW USERS ---
const DATA_EMPTY: TransformedAnalyticsUI = {
  global: { testsTaken: 0, avgScore: 0, accuracy: 0, consistency: 0 },
  graph: [],
  radar: [],
  deepDive: [],
  efficiency: { mcqAcc: 0, numAcc: 0, leakage: 0, momentum: 0 },
  weakness: [],
  recentTests: [] // <--- ADD THIS LINE
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 5 Tests");

  // Zustand Store
  const { 
    rawAnalytics, 
    isLoading, 
    error, 
    setAnalyticsData, 
    setLoading, 
    setError, 
    isNewUser 
  } = useAnalyticsStore();

  // Fetch Data on Mount
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetchAnalyticsData();
        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          setError("Failed to load analytics data.");
        }
      } catch (err: unknown) {
        console.error("Analytics Fetch Error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    if (!rawAnalytics) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [rawAnalytics, setAnalyticsData, setLoading, setError]);

  // Loading State (Tailwind styling matching your dark theme)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#a1a1aa] text-sm">
        <div className="w-10 h-10 border-4 border-[#f59e0b33] border-t-[#f59e0b] rounded-full animate-spin mb-4"></div>
        <p>Crunching your performance data...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 text-sm">
        Error: {error}
      </div>
    );
  }

  const newUser = isNewUser();
  
  // Transform data based on the selected time range from the header
  const transformedData = transformAnalyticsData(rawAnalytics, timeRange);
  
  // If the user is new or the data failed to transform, fallback to the empty state gracefully
  const currentData = (newUser || !transformedData) ? DATA_EMPTY : transformedData;

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen">
      
      {/* 1. Header with Filter Dropdown */}
      <AnalyticsHeader 
        selectedRange={timeRange} 
        onRangeChange={setTimeRange} 
      />

      {/* 2. Top Stats Row */}
      <GlobalStats data={currentData.global} />

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-[16px]">
        <div className="lg:col-span-2">
          <PerformanceGraph data={currentData.graph} />
        </div>
        <div className="lg:col-span-1">
          <SubjectRadar data={currentData.radar} />
        </div>
      </div>

      {/* 4. Subject Deep Dive Cards */}
      <SubjectDeepDive data={currentData.deepDive} />

      {/* 5. Strategic Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-[16px]">
        <EfficiencyMatrix data={currentData.efficiency} />
        <WeaknessHunter data={currentData.weakness} />
      </div>

      {/* 6. Recent Activity */}
      {/* Passing the 'isEmpty' prop to handle empty state visuals inside the list component */}
      <RecentTestsList isEmpty={newUser} data={currentData.recentTests} />
    </div>
  );
}