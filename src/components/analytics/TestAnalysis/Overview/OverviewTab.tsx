"use client";

import React from "react";
import { ScoreCard } from "./ScoreCard";
import { PercentileCard } from "./PercentileCard";
import { KeyStatsGrid } from "./KeyStatsGrid";
import { SubjectSummaryTable } from "./SubjectSummaryTable";
import { ComparativeOverview } from "./ComparativeOverview";

export const OverviewTab = () => {
  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-500 pb-8">
      
      {/* 1. HERO ROW: Score (2/3) & Percentile (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 min-h-[220px]">
        <div className="lg:col-span-2">
          <ScoreCard />
        </div>
        <div className="lg:col-span-1">
          <PercentileCard />
        </div>
      </div>
      
      {/* 2. STATS GRID */}
      {/* Note: KeyStatsGrid manages its own internal grid, but sits in the flow here */}
      <KeyStatsGrid />

      {/* 3. DETAILS ROW: Subjects (2/3) & Benchmarking (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
        <div className="lg:col-span-2 min-h-[300px]">
          <SubjectSummaryTable />
        </div>
        <div className="lg:col-span-1 min-h-[300px]">
          <ComparativeOverview />
        </div>
      </div>

    </div>
  );
};