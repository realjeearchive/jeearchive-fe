"use client";

import React, { useState, useEffect } from "react";
import styles from "./dashboardPage.module.css";

import DashboardHeader, {
  ExamFilter,
} from "@/components/dashboard/DashboardHeader/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard/KpiCard";
import PyqProgressCard from "@/components/dashboard/PyqProgressCard/PyqProgressCard";
import ScoreGrowthChart from "@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart";
import SubjectBalanceRadar from "@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar";
import QuestionTypeBar from "@/components/dashboard/QuestionTypeBar/QuestionsTypeBar";
import TestListSection, {
  TestListItem,
} from "@/components/dashboard/TestListSection/TestListSection";
import DetailedAnalysisSection from "@/components/dashboard/DetailedAnalysisSection/DetailedAnalysisSection";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner/WelcomeBanner";
import { Loader } from "@/components/ui/loader";

import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

import { useDashboardStore } from "@/store/useDashboardStore";
import { fetchDashboardData } from "@/features/dashboard/api";
import { transformDashboardData } from "@/features/dashboard/dashboardTransformer";

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

  const {
    rawReport,
    isLoading,
    error,
    setDashboardData,
    setLoading,
    setError,
    isNewUser,
  } = useDashboardStore();

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
        setError("Connection drop. Please refresh.");
      }
    };

    if (!rawReport) loadDashboard();
    else setLoading(false);
  }, [rawReport, setDashboardData, setLoading, setError]);

  if (isLoading && !isRateLimited) {
    return (
      <main className={styles.loaderContainer} aria-label="Loading dashboard">
        <Loader label="Analyzing your performance..." />
      </main>
    );
  }

  if (error && !isRateLimited) {
    return (
      <main
        className={styles.errorContainer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          gap: "16px",
        }}
        aria-label="Dashboard error"
      >
        <FiAlertTriangle size={32} color="#ef4444" aria-hidden="true" />
        <div
          style={{
            color: "var(--text-primary)",
            fontSize: "16px",
            fontWeight: 500,
          }}
          role="alert"
        >
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "var(--color-brand-primary)",
            color: "#000",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
          aria-label="Refresh dashboard"
        >
          <FiRefreshCw size={14} aria-hidden="true" /> Try Again
        </button>
      </main>
    );
  }

  const newUser = isNewUser();
  const uiData = transformDashboardData(rawReport, examFilter);

  return (
    <>
      <RateLimitModal />

      {uiData && (
        <main className={styles.page} aria-label="Dashboard">
          {!newUser && (
            <DashboardHeader
              currentView={viewMode}
              onViewChange={setViewMode}
              examFilter={examFilter}
              onExamFilterChange={setExamFilter}
            />
          )}

          {newUser && (
            <div style={{ marginBottom: "8px" }}>
              <WelcomeBanner />
            </div>
          )}

          <section className={styles.progressRow} aria-label="Subject progress">
            <PyqProgressCard
              label="Physics"
              solved={uiData.progress.phy.solved}
              total={uiData.progress.phy.total}
            />
            <PyqProgressCard
              label="Chemistry"
              solved={uiData.progress.chem.solved}
              total={uiData.progress.chem.total}
            />
            <PyqProgressCard
              label="Mathematics"
              solved={uiData.progress.math.solved}
              total={uiData.progress.math.total}
            />
          </section>

          <section className={styles.kpiRow} aria-label="Key performance indicators">
            {viewMode === "test"
              ? uiData.testKpis.map((kpi, i) => (
                  <KpiCard
                    key={i}
                    label={kpi.label}
                    value={kpi.value}
                    subLabel={kpi.sub}
                    icon={kpi.icon}
                  />
                ))
              : uiData.chapterKpis.map((kpi, i) => (
                  <KpiCard
                    key={i}
                    label={kpi.label}
                    value={kpi.value}
                    subLabel={kpi.sub}
                    icon={kpi.icon}
                  />
                ))}
          </section>

          <>
            {viewMode === "test" ? (
              <section className={styles.growthSection} aria-label="Score growth chart">
                <ScoreGrowthChart data={uiData.scoreData} />
              </section>
            ) : (
              <section className={styles.bottomRow} aria-label="Subject and question type analysis">
                <div className={styles.bottomItem}>
                  <SubjectBalanceRadar data={uiData.radarData} />
                </div>
                <div className={styles.bottomItem}>
                  <QuestionTypeBar data={uiData.typeData} />
                </div>
              </section>
            )}
          </>
        </main>
      )}
    </>
  );
}