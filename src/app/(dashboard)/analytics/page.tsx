"use client";

import React, { useState } from "react";
import AnalyticsHeader, { TimeRange } from "@/components/analytics/AnalyticsHeader/AnalyticsHeader";

// Components
import { GlobalStats } from "@/components/analytics/Overall/GlobalStats/GlobalStats";
import { PerformanceGraph } from "@/components/analytics/Overall/PerformanceGraph/PerformanceGraph";
import { SubjectRadar } from "@/components/analytics/Overall/SubjectRadar/SubjectRadar";
import { RecentTestsList } from "@/components/analytics/Overall/RecentTestsList/RecentTestsList";
import { SubjectDeepDive } from "@/components/analytics/Overall/SubjectDeepDive/SubjectDeepDive";
import { EfficiencyMatrix } from "@/components/analytics/Overall/EfficiencyMatrix/EfficiencyMatrix";
import { WeaknessHunter } from "@/components/analytics/Overall/WeaknessHunter/WeaknessHunter";

// --- DUMMY DATA FOR FILTERING ---
const DATA_LAST_3 = {
  global: { testsTaken: 3, avgScore: 152, accuracy: 78.2, consistency: 9.0 },
  graph: [
    { x: 'Test 7', y: 142 }, { x: 'Test 8', y: 155 }, { x: 'Test 9', y: 158 }
  ],
  radar: [
    { subject: 'Physics', Accuracy: 75 }, { subject: 'Chemistry', Accuracy: 85 }, { subject: 'Maths', Accuracy: 70 }
  ],
  deepDive: [
    { subject: "Physics", avgScore: 68, accuracy: 75, negatives: 12, avgTime: 52 },
    { subject: "Chemistry", avgScore: 82, accuracy: 85, negatives: 8, avgTime: 40 },
    { subject: "Mathematics", avgScore: 50, accuracy: 70, negatives: 5, avgTime: 70 }
  ],
  efficiency: { fastCorrect: 48, slowCorrect: 22, fastWrong: 12, slowWrong: 18 },
  weakness: [
    { chapter: "Rotational Motion", subject: "Physics", accuracy: 32 },
    { chapter: "Thermodynamics", subject: "Chemistry", accuracy: 45 }
  ]
};

const DATA_LAST_5 = {
  global: { testsTaken: 5, avgScore: 145, accuracy: 76.5, consistency: 8.2 },
  graph: [
    { x: 'Test 5', y: 130 }, { x: 'Test 6', y: 138 }, { x: 'Test 7', y: 142 }, { x: 'Test 8', y: 155 }, { x: 'Test 9', y: 158 }
  ],
  radar: [
    { subject: 'Physics', Accuracy: 72 }, { subject: 'Chemistry', Accuracy: 81 }, { subject: 'Maths', Accuracy: 65 }
  ],
  deepDive: [
    { subject: "Physics", avgScore: 65, accuracy: 72, negatives: 15, avgTime: 55 },
    { subject: "Chemistry", avgScore: 78, accuracy: 81, negatives: 10, avgTime: 45 },
    { subject: "Mathematics", avgScore: 45, accuracy: 65, negatives: 8, avgTime: 75 }
  ],
  efficiency: { fastCorrect: 45, slowCorrect: 20, fastWrong: 15, slowWrong: 20 },
  weakness: [
    { chapter: "Electrostatics", subject: "Physics", accuracy: 40 },
    { chapter: "Integration", subject: "Maths", accuracy: 35 }
  ]
};

const DATA_ALL = {
  global: { testsTaken: 12, avgScore: 138, accuracy: 74.0, consistency: 7.5 },
  graph: [
    { x: 'T1', y: 110 }, { x: 'T2', y: 115 }, { x: 'T3', y: 105 }, { x: 'T4', y: 125 }, 
    { x: 'T5', y: 130 }, { x: 'T6', y: 138 }, { x: 'T7', y: 142 }, { x: 'T8', y: 155 }, { x: 'T9', y: 158 }
  ],
  radar: [
    { subject: 'Physics', Accuracy: 68 }, { subject: 'Chemistry', Accuracy: 75 }, { subject: 'Maths', Accuracy: 60 }
  ],
  deepDive: [
    { subject: "Physics", avgScore: 60, accuracy: 68, negatives: 18, avgTime: 58 },
    { subject: "Chemistry", avgScore: 72, accuracy: 75, negatives: 15, avgTime: 42 },
    { subject: "Mathematics", avgScore: 40, accuracy: 60, negatives: 12, avgTime: 78 }
  ],
  efficiency: { fastCorrect: 42, slowCorrect: 18, fastWrong: 20, slowWrong: 20 },
  weakness: [
    { chapter: "Fluid Mechanics", subject: "Physics", accuracy: 28 },
    { chapter: "Organic Chemistry", subject: "Chemistry", accuracy: 50 }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 5 Tests");

  // Filter Logic
  const currentData = 
    timeRange === "Last 3 Tests" ? DATA_LAST_3 : 
    timeRange === "All Tests" ? DATA_ALL : DATA_LAST_5;

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen">
      
      {/* 1. Header with Filter */}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        <EfficiencyMatrix data={currentData.efficiency} />
        <WeaknessHunter data={currentData.weakness} />
      </div>

      {/* 6. Recent Activity */}
      <RecentTestsList />
    </div>
  );
}