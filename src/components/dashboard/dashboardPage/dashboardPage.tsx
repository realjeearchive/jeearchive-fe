"use client";

import React, { useState } from 'react';
import styles from './dashboardPage.module.css';

import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import PyqProgressCard from "@/components/dashboard/PyqProgressCard/PyqProgressCard";
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import DetailedAnalysisSection from '@/components/dashboard/DetailedAnalysisSection/DetailedAnalysisSection';

import { FiAward, FiClock, FiTarget, FiCheckSquare } from 'react-icons/fi';
import WelcomeBanner from '../WelcomeBanner/WelcomeBanner';

interface KpiItem {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  delta?: string;
}

interface ScorePoint {
  x: string | number;
  y: number;
}

interface ScoreSeries {
  id: string | number;
  data: ScorePoint[];
}

interface RadarItem {
  subject: string;
  Accuracy: number;
}

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
  scoreData: ScoreSeries[];
  radarData: RadarItem[];
  typeData: TypeItem[];
}

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

  const isNewUser = true; 

  const data = isNewUser ? EMPTY_DATA : ACTIVE_DATA;

  return (
    <div className={styles.page}>
      
      <DashboardHeader currentView={viewMode} onViewChange={setViewMode} />

      {isNewUser && (
        <div style={{ marginBottom: '8px' }}>
          <WelcomeBanner />
        </div>
      )}

      <div className={styles.progressRow}>
        <PyqProgressCard label="Physics" solved={data.progress.phy.solved} total={data.progress.phy.total} />
        <PyqProgressCard label="Chemistry" solved={data.progress.chem.solved} total={data.progress.chem.total} />
        <PyqProgressCard label="Mathematics" solved={data.progress.math.solved} total={data.progress.math.total} />
      </div>

      <div className={styles.kpiRow}>
        {data.kpis.map((kpi, i) => (
          <KpiCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.sub}
            icon={kpi.icon}
            deltaLabel={kpi.delta}
          />
        ))}
      </div>


      <div className={styles.growthSection}>
        <ScoreGrowthChart data={data.scoreData} />
      </div>

      {!isNewUser && 
      
      <div className={styles.bottomRow}>
        <div className={styles.bottomItem}>
          <SubjectBalanceRadar data={data.radarData} />
        </div>
        <div className={styles.bottomItem}>
          <QuestionTypeBar data={data.typeData} />
        </div>
      </div>
      }

      <div className={styles.listSectionWrapper}>
        <TestListSection heading="Previous Year Question Papers" items={pyqItems} />
        <TestListSection heading="Chapter-wise Practice" items={chapterItems} />
      </div>

      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection disabled={isNewUser} />
      </div>
    </div>
  );
}