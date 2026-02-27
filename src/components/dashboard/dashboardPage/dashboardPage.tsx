"use client";

import React, { useState, useEffect } from 'react';
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
import WelcomeBanner from '@/components/dashboard/WelcomeBanner/WelcomeBanner';

// Logic & Store
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchDashboardData } from '@/features/dashboard/api';
import { transformDashboardData } from '@/features/dashboard/dashboardTransformer';

const pyqItems: TestListItem[] = [
  { id: "pyq-2025", title: "JEE Main 2025 PYQs", meta: "19 Papers", href: "/pyq/2025" },
  { id: "pyq-2024", title: "JEE Main 2024 PYQs", meta: "20 Papers", href: "/pyq/2024" },
];
const chapterItems: TestListItem[] = [
  { id: "phy", title: "Physics Chapters", meta: "32 Chapters", href: "/practice/phy" },
  { id: "chem", title: "Chemistry Chapters", meta: "35 Chapters", href: "/practice/chem" },
];

export default function DashboardPage() {
  // THIS is the toggle state
  const [viewMode, setViewMode] = useState<"test" | "chapter">("test");

  const { rawReport, isLoading, error, setDashboardData, setLoading, setError, isNewUser } = useDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardData();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load data.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred");
      }
    };

    if (!rawReport) loadDashboard();
    else setLoading(false);
  }, [rawReport, setDashboardData, setLoading, setError]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Analyzing your performance...</p>
      </div>
    );
  }

  if (error) return <div className={styles.errorContainer}>Error: {error}</div>;

  const newUser = isNewUser();
  const uiData = transformDashboardData(rawReport); 

  if (!uiData) return null; 

  // DYNAMICALLY SELECT KPIs BASED ON TOGGLE
  const activeKpis = viewMode === "test" ? uiData.testKpis : uiData.chapterKpis;

  return (
    <div className={styles.page}>
      
      {!newUser && 
        <DashboardHeader currentView={viewMode} onViewChange={setViewMode} />
      }

      {newUser && (
        <div style={{ marginBottom: '8px' }}>
          <WelcomeBanner />
        </div>
      )}

      {/* 1. Progress Cards (Global) */}
      <div className={styles.progressRow}>
        <PyqProgressCard label="Physics" solved={uiData.progress.phy.solved} total={uiData.progress.phy.total} />
        <PyqProgressCard label="Chemistry" solved={uiData.progress.chem.solved} total={uiData.progress.chem.total} />
        <PyqProgressCard label="Mathematics" solved={uiData.progress.math.solved} total={uiData.progress.math.total} />
      </div>

      {/* 2. Dynamic KPI Row */}
      <div className={styles.kpiRow}>
        {activeKpis.map((kpi, i) => (
          <KpiCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            subLabel={kpi.sub}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* 3. Dynamic Charts Section */}
      {!newUser && (
        <>
          {viewMode === "test" ? (
            // Show Score Growth for Mock Tests
            <div className={styles.growthSection}>
              <ScoreGrowthChart data={uiData.scoreData} />
            </div>
          ) : (
            // Show Radar & Type Bar for Chapter Practice
            <div className={styles.bottomRow}>
              <div className={styles.bottomItem}>
                <SubjectBalanceRadar data={uiData.radarData} />
              </div>
              <div className={styles.bottomItem}>
                <QuestionTypeBar data={uiData.typeData} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Static Lists & Analysis CTA */}
      <div className={styles.listSectionWrapper}>
        <TestListSection heading="Previous Year Question Papers" items={pyqItems} />
        <TestListSection heading="Chapter-wise Practice" items={chapterItems} />
      </div>

      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection disabled={newUser} />
      </div>
    </div>
  );
}