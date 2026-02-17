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
import { FiAward, FiClock, FiTarget, FiCheckSquare } from 'react-icons/fi';
import WelcomeBanner from '../WelcomeBanner/WelcomeBanner';

// --- TYPE DEFINITIONS ---

interface KpiItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  delta?: string;
}

// Type for the Line Chart (Score Growth)
interface ScorePoint {
  x: string | number;
  y: number;
}

interface ScoreSeries {
  id: string | number;
  data: ScorePoint[];
}

// Type for the Radar Chart (Subject Balance)
interface RadarItem {
  subject: string;
  Accuracy: number;
}

// Type for the Bar Chart (Question Type)
interface TypeItem {
  type: string;
  accuracy: number;
}

interface DashboardData {
  progress: {
    phy: { solved: number; total: number };
    chem: { solved: number; total: number };
    math: { solved: number; total: number };
  };
  kpis: KpiItem[];
  scoreData: ScoreSeries[]; // Replaced 'any[]'
  radarData: RadarItem[];   // Replaced 'any[]'
  typeData: TypeItem[];     // Replaced 'any[]'
}

// --- DATA SIMULATION ---

// 1. DATA FOR A NEW USER (Empty State)
const EMPTY_DATA: DashboardData = {
  progress: { 
    phy: { solved: 0, total: 3200 }, 
    chem: { solved: 0, total: 3200 }, 
    math: { solved: 0, total: 3200 } 
  },
  kpis: [
    { label: "Mock Accuracy", value: "--", sub: "No data yet", icon: <FiTarget size={16} /> },
    { label: "Paper Speed", value: "--", sub: "Avg Time / Question", icon: <FiClock size={16} /> },
    { label: "AIR Prediction", value: "--", sub: "Take a test to see", icon: <FiAward size={16} /> },
    { label: "Mocks Attempted", value: "0", sub: "Full Syllabus Tests", icon: <FiCheckSquare size={16} /> },
  ],
  scoreData: [],
  radarData: [],
  typeData: [],
};

// 2. DATA FOR AN ACTIVE USER (Populated State)
const ACTIVE_DATA: DashboardData = {
  progress: { 
    phy: { solved: 1850, total: 3200 }, 
    chem: { solved: 2100, total: 3200 }, 
    math: { solved: 940, total: 3200 } 
  },
  kpis: [
    { label: "Mock Accuracy", value: "76.4%", sub: "Avg in last 5 Mocks", delta: "+2.4%", icon: <FiTarget size={16} /> },
    { label: "Paper Speed", value: "42s", sub: "Avg Time / Question", delta: "-5s", icon: <FiClock size={16} /> },
    { label: "AIR Prediction", value: "~2,400", sub: "Based on current score", delta: "Top 1.5%", icon: <FiAward size={16} /> },
    { label: "Mocks Attempted", value: "14", sub: "Full Syllabus Tests", delta: "+2 this week", icon: <FiCheckSquare size={16} /> },
  ],
  scoreData: [{ 
    id: 'Mock Score', 
    data: [{ x: 'Mock 1', y: 140 }, { x: 'Mock 2', y: 155 }, { x: 'Mock 3', y: 148 }, { x: 'Mock 4', y: 172 }, { x: 'Mock 5', y: 185 }] 
  }],
  radarData: [
    { subject: 'Physics', Accuracy: 72 }, 
    { subject: 'Chemistry', Accuracy: 81 }, 
    { subject: 'Maths', Accuracy: 65 }
  ],
  typeData: [
    { type: 'MCQ', accuracy: 82 }, 
    { type: 'Integer', accuracy: 74 }
  ],
};

// Static Lists
const pyqItems: TestListItem[] = [
  { id: "pyq-2025", title: "JEE Main 2025 PYQs", meta: "19 Papers", href: "/pyq/2025" },
  { id: "pyq-2024", title: "JEE Main 2024 PYQs", meta: "20 Papers", href: "/pyq/2024" },
];
const chapterItems: TestListItem[] = [
  { id: "phy", title: "Physics Chapters", meta: "32 Chapters", href: "/practice/phy" },
  { id: "chem", title: "Chemistry Chapters", meta: "35 Chapters", href: "/practice/chem" },
];


export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"test" | "chapter">("test");

  // --- TOGGLE THIS TO SEE EMPTY STATE ---
  // In a real app, this would come from your user store (e.g. !user.hasTakenTest)
  const isNewUser = true; 

  const data = isNewUser ? EMPTY_DATA : ACTIVE_DATA;

  return (
    <div className={styles.page}>
      
      {/* 1. Header */}
      <DashboardHeader currentView={viewMode} onViewChange={setViewMode} />

      {/* NEW: Welcome Banner only for new users */}
      {isNewUser && (
        <div style={{ marginBottom: '8px' }}>
          <WelcomeBanner />
        </div>
      )}

      {/* 2. Progress Cards */}
      <div className={styles.progressRow}>
        <PyqProgressCard label="Physics" solved={data.progress.phy.solved} total={data.progress.phy.total} />
        <PyqProgressCard label="Chemistry" solved={data.progress.chem.solved} total={data.progress.chem.total} />
        <PyqProgressCard label="Mathematics" solved={data.progress.math.solved} total={data.progress.math.total} />
      </div>

      {/* 3. KPIs */}
      <div className={styles.kpiRow}>
        {data.kpis.map((kpi, i) => (
          <KpiCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.sub}
            icon={kpi.icon}
            deltaLabel={kpi.delta} // No error now, as delta is optional in KpiItem
          />
        ))}
      </div>

      {/* 4. Charts */}
      <div className={styles.growthSection}>
        <ScoreGrowthChart data={data.scoreData} />
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomItem}>
          <SubjectBalanceRadar data={data.radarData} />
        </div>
        <div className={styles.bottomItem}>
          <QuestionTypeBar data={data.typeData} />
        </div>
      </div>

      {/* 5. Lists */}
      <div className={styles.listSectionWrapper}>
        <TestListSection heading="Previous Year Question Papers" items={pyqItems} />
        <TestListSection heading="Chapter-wise Practice" items={chapterItems} />
      </div>

      {/* 6. Detailed Analysis (Locked for New Users) */}
      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection disabled={isNewUser} />
      </div>
    </div>
  );
}