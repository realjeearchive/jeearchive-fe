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
import { Loader } from '@/components/ui/loader'; // 🔥 UNIFIED LOADER IMPORT

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
  const [viewMode, setViewMode] = useState<"test" | "chapter">("test");

  const { rawReport, isLoading, error, setDashboardData, setLoading, setError, isNewUser } = useDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardData();
        if (response.success && response.data) {
          console.info("[Dashboard] Successfully loaded performance graphs.");
          setDashboardData(response.data);
        } else {
          setError("Metrics unavailable.");
        }
      } catch (err: unknown) {
        console.error("[Dashboard] Background fetch failed:", err);
        if (err instanceof Error) {
          setError("Connection drop. Please refresh.");
        } else {
          setError("Connection drop. Please refresh.");
        }
      }
    };

    if (!rawReport) loadDashboard();
    else setLoading(false);
  }, [rawReport, setDashboardData, setLoading, setError]);

  // 🔥 FIXED: Standardized loader implementation matching the test suite
  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader label="Analyzing your performance..." />
      </div>
    );
  }

  if (error) return <div className={styles.errorContainer}>Error: {error}</div>;

  const newUser = isNewUser();
  const uiData = transformDashboardData(rawReport); 

  if (!uiData) return null; 

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

      <div className={styles.progressRow}>
        <PyqProgressCard label="Physics" solved={uiData.progress.phy.solved} total={uiData.progress.phy.total} />
        <PyqProgressCard label="Chemistry" solved={uiData.progress.chem.solved} total={uiData.progress.chem.total} />
        <PyqProgressCard label="Mathematics" solved={uiData.progress.math.solved} total={uiData.progress.math.total} />
      </div>

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

      {!newUser && (
        <>
          {viewMode === "test" ? (
            <div className={styles.growthSection}>
              <ScoreGrowthChart data={uiData.scoreData} />
            </div>
          ) : (
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

      <div className={styles.listSectionWrapper}>
        <TestListSection 
          heading="Recent Mock Tests" 
          items={uiData.recentTestItems.length > 0 ? uiData.recentTestItems : pyqItems} 
        />
        <TestListSection heading="Chapter-wise Practice" items={chapterItems} />
      </div>

      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection disabled={newUser} />
      </div>
    </div>
  );
}