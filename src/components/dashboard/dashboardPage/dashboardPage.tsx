"use client";

import React, { useState } from 'react';
import styles from './dashboardPage.module.css';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import PyqProgressCard from "@/components/dashboard/PyqProgressCard/PyqProgressCard";
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import DetailedAnalysisSection from '@/components/dashboard/DetailedAnalysisSection/DetailedAnalysisSection';

// Icons
import { FiAward, FiClock, FiTarget, FiTrendingUp, FiCheckSquare, FiActivity, FiZap, FiLayers } from 'react-icons/fi';

// --- CONSTANT DATA (Does not change with filter) ---
// Since PYQ progress is cumulative of all attempts
const OVERALL_PROGRESS = {
  phy: { solved: 1850, total: 3200 },
  chem: { solved: 2100, total: 3200 },
  math: { solved: 940, total: 3200 },
};

// --- DATA: MOCK TEST VIEW ---
const TEST_VIEW_DATA = {
  kpis: [
    { label: "Mock Accuracy", value: "76.4%", sub: "Avg in last 5 Mocks", delta: "+2.4%", icon: <FiTarget size={18} /> },
    { label: "Paper Speed", value: "42s", sub: "Avg Time / Question", delta: "-5s", icon: <FiClock size={18} /> },
    { label: "AIR Prediction", value: "~2,400", sub: "Based on current score", delta: "Top 1.5%", icon: <FiAward size={18} /> },
    { label: "Mocks Attempted", value: "14", sub: "Full Syllabus Tests", delta: "+2 this week", icon: <FiCheckSquare size={18} /> },
  ],
  scoreData: [{
    id: 'Mock Score',
    data: [
      { x: 'Mock 1', y: 140 }, { x: 'Mock 2', y: 155 }, { x: 'Mock 3', y: 148 }, { x: 'Mock 4', y: 172 }, { x: 'Mock 5', y: 185 },
    ],
  }],
  radarData: [
    { subject: 'Physics', Accuracy: 72 }, { subject: 'Chemistry', Accuracy: 81 }, { subject: 'Maths', Accuracy: 65 },
  ],
  typeData: [
    { type: 'MCQ', accuracy: 82 }, { type: 'Integer', accuracy: 74 },
  ]
};

// --- DATA: CHAPTER PRACTICE VIEW ---
const CHAPTER_VIEW_DATA = {
  kpis: [
    { label: "Practice Accuracy", value: "82%", sub: "Across all topics", delta: "+5.1%", icon: <FiLayers size={18} /> },
    { label: "Daily Problems", value: "45", sub: "Questions / Day avg", delta: "+12", icon: <FiActivity size={18} /> },
    { label: "Strong Chapters", value: "28", sub: ">85% Accuracy", delta: "+3 new", icon: <FiZap size={18} /> },
    { label: "Consistency", value: "12 Days", sub: "Study Streak", delta: "Keep going!", icon: <FiTrendingUp size={18} /> },
  ],
  scoreData: [{
    id: 'Questions Solved',
    data: [
      { x: 'Mon', y: 45 }, { x: 'Tue', y: 60 }, { x: 'Wed', y: 30 }, { x: 'Thu', y: 85 }, { x: 'Fri', y: 110 },
    ],
  }],
  radarData: [
    { subject: 'Physics', Accuracy: 88 }, { subject: 'Chemistry', Accuracy: 92 }, { subject: 'Maths', Accuracy: 74 },
  ],
  typeData: [
    { type: 'MCQ', accuracy: 88 }, { type: 'Integer', accuracy: 65 }, { type: 'Match', accuracy: 90 },
  ]
};

// Static List Data
const pyqItems: TestListItem[] = [
  { id: "pyq-2025", title: "JEE Main 2025 PYQs", meta: "19 Papers", href: "/pyq/2025" },
  { id: "pyq-2024", title: "JEE Main 2024 PYQs", meta: "20 Papers", href: "/pyq/2024" },
  { id: "pyq-2023", title: "JEE Main 2023 PYQs", meta: "18 Papers", href: "/pyq/2023" },
];
const chapterItems: TestListItem[] = [
  { id: "phy", title: "Physics Chapters", meta: "32 Chapters", href: "/practice/phy" },
  { id: "chem", title: "Chemistry Chapters", meta: "35 Chapters", href: "/practice/chem" },
  { id: "math", title: "Mathematics Chapters", meta: "30 Chapters", href: "/practice/math" },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"test" | "chapter">("test");

  // Switch Data Source
  const currentData = viewMode === "test" ? TEST_VIEW_DATA : CHAPTER_VIEW_DATA;

  return (
    <div className={styles.page}>
      
      {/* 1. Enhanced Header with Dropdown */}
      <DashboardHeader 
        currentView={viewMode} 
        onViewChange={setViewMode} 
      />

      {/* 2. Static Progress Cards (Always visible, total count) */}
      <div className={styles.progressRow}>
        <PyqProgressCard 
          label="Physics" 
          solved={OVERALL_PROGRESS.phy.solved} 
          total={OVERALL_PROGRESS.phy.total} 
        />
        <PyqProgressCard 
          label="Chemistry" 
          solved={OVERALL_PROGRESS.chem.solved} 
          total={OVERALL_PROGRESS.chem.total}  
        />
        <PyqProgressCard 
          label="Mathematics" 
          solved={OVERALL_PROGRESS.math.solved} 
          total={OVERALL_PROGRESS.math.total}  
        />
      </div>

      {/* 3. Dynamic KPIs based on View Mode */}
      <div className={styles.kpiRow}>
        {currentData.kpis.map((kpi, i) => (
          <KpiCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.sub}
            icon={kpi.icon}
            deltaLabel={kpi.delta}
            tone="mint"
          />
        ))}
      </div>

      {/* 4. Dynamic Charts */}
      <div className={styles.growthSection}>
        <ScoreGrowthChart data={currentData.scoreData} />
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomItem}>
          <SubjectBalanceRadar data={currentData.radarData} />
        </div>
        <div className={styles.bottomItem}>
          <QuestionTypeBar data={currentData.typeData} />
        </div>
      </div>

      {/* 5. Static Navigation Links */}
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 40 }}>
        <TestListSection heading="Previous Year Question Papers" items={pyqItems} />
        <TestListSection heading="Chapter-wise Practice" items={chapterItems} />
      </div>

      {/* 6. Detailed Analysis Banner */}
      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection />
      </div>
    </div>
  );
}