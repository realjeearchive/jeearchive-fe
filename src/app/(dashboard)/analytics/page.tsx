import React from "react";
import { GlobalStats } from "@/components/analytics/Overall/GlobalStats/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList/RecentTestsList";
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive";
import { DifficultyTrap } from "@/components/analytics/Overall/DifficultyTrap/DifficultyTrap";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter/WeaknessHunter";

export default function AnalyticsPage() {
  return (
    <div className=" sm:p-2 max-w-[1600px] mx-auto min-h-screen">
      <h1 className="text-xl font-bold text-[var(--dashboard-primary-text-color)] mb-2 px-1">
        Overall Performance
      </h1>

      {/* 1. Top Stats Row */}
      <GlobalStats />

      {/* 2. Charts Row (Trend + Radar) - Tight Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
        <div className="lg:col-span-2">
          <PerformanceGraph />
        </div>
        <div className="lg:col-span-1">
          <SubjectRadar />
        </div>
      </div>

      {/* 3. Subject Deep Dive Cards */}
      <SubjectDeepDive />

      {/* 4. Strategic Insights Row (Difficulty + Weakness) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        <DifficultyTrap />
        <WeaknessHunter />
      </div>

      {/* 5. Recent Activity */}
      <RecentTestsList />
    </div>
  );
}