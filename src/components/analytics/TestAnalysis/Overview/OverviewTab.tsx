"use client";

import React from "react";
import { ScoreCard } from "./ScoreCard";
import { PercentileCard } from "./PercentileCard";
import { KeyStatsGrid } from "./KeyStatsGrid";

export const OverviewTab = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card takes 2 columns */}
        <div className="lg:col-span-2">
          <ScoreCard />
        </div>
        {/* Percentile Card takes 1 column */}
        <div className="lg:col-span-1">
          <PercentileCard />
        </div>
      </div>
      
      {/* Stats Grid below */}
      <KeyStatsGrid />
    </div>
  );
};