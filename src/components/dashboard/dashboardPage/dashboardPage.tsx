"use client";

import React, { useState, useEffect } from 'react';
import styles from './dashboardPage.module.css';

import DashboardHeader, { ExamFilter } from '@/components/dashboard/DashboardHeader/DashboardHeader';
import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import PyqProgressCard from "@/components/dashboard/PyqProgressCard/PyqProgressCard";
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';
import TestListSection, { TestListItem } from "@/components/dashboard/TestListSection/TestListSection";
import DetailedAnalysisSection from '@/components/dashboard/DetailedAnalysisSection/DetailedAnalysisSection';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner/WelcomeBanner';
import { Loader } from '@/components/ui/loader';

// 🚨 NEW: Import the Modal, Store, and Icons for the fallback error state
import { RateLimitModal } from '@/components/ui/RateLimitModal/RateLimitModal';
import { useRateLimitStore } from '@/store/useRateLimitStore';
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

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
  const [examFilter, setExamFilter] = useState<ExamFilter>("overall");

  const { rawReport, isLoading, error, setDashboardData, setLoading, setError, isNewUser } = useDashboardStore();
  
  // 🚨 NEW: Listen to global rate limit state
  const { isRateLimited } = useRateLimitStore(); 

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await fetchDashboardData();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError("Metrics unavailable.");
        }
      } catch (err: unknown) {
        // If it's a 429, the global store handles it. We just set a generic error to stop loading.
        setError("Connection drop. Please refresh.");
      }
    };

    if (!rawReport) loadDashboard();
    else setLoading(false);
  }, [rawReport, setDashboardData, setLoading, setError]);

  // 🚨 FIX: Only show the loader if we are NOT rate limited. 
  // If we are rate limited, the modal will handle the UI.
  if (isLoading && !isRateLimited) {
    return (
      <div className={styles.loaderContainer}>
        <Loader label="Analyzing your performance..." />
      </div>
    );
  }

  // 🚨 FIX: Upgraded generic error UI (Only visible if NOT rate limited)
  if (error && !isRateLimited) {
    return (
      <div className={styles.errorContainer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '16px' }}>
        <FiAlertTriangle size={32} color="#ef4444" />
        <div style={{ color: 'var(--dashboard-primary-text-color)', fontSize: '16px', fontWeight: 500 }}>
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--dashboard-core-color)', color: '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <FiRefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  const newUser = isNewUser();
  const uiData = transformDashboardData(rawReport, examFilter);

  return (
    <>
      {/* 🚨 THE RATE LIMIT MODAL - Mounts globally over everything if triggered */}
      <RateLimitModal />

      {/* 🚨 Render the dashboard only if we have data or if the modal is currently covering the screen */}
      {uiData && (
        <div className={styles.page}>
          {!newUser && (
            <DashboardHeader
              currentView={viewMode}
              onViewChange={setViewMode}
              examFilter={examFilter}
              onExamFilterChange={setExamFilter}
            />
          )}

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
            {viewMode === "test" ? uiData.testKpis.map((kpi, i) => (
              <KpiCard key={i} label={kpi.label} value={kpi.value} subLabel={kpi.sub} icon={kpi.icon} />
            )) : uiData.chapterKpis.map((kpi, i) => (
              <KpiCard key={i} label={kpi.label} value={kpi.value} subLabel={kpi.sub} icon={kpi.icon} />
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
        </div>
      )}
    </>
  );
}