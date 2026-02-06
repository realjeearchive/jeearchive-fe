import React from "react";
import { GlobalStats } from "@/components/analytics/Overall/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList";

// NEW IMPORTS
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive";
import { DifficultyTrap } from "@/components/analytics/Overall/DifficultyTrap";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter";

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-[var(--dashboard-primary-text-color)] mb-6">
        Overall Performance
      </h1>

      {/* 1. Top Stats Row */}
      <GlobalStats />

      {/* 2. Charts Row (Trend + Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PerformanceGraph />
        </div>
        <div className="lg:col-span-1">
          <SubjectRadar />
        </div>
      </div>

      {/* 3. NEW: Subject Deep Dive Cards */}
      <SubjectDeepDive />

      {/* 4. NEW: Strategic Insights Row (Difficulty + Weakness) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DifficultyTrap />
        <WeaknessHunter />
      </div>

      {/* 5. Recent Activity */}
      <RecentTestsList />
    </div>
  );
}