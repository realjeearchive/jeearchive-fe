"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import { FiTarget, FiMinusCircle, FiClock, FiAlertCircle, FiLock } from "react-icons/fi";
import styles from "./SubjectDeepDive.module.css";

export interface SubjectStats {
  subject: string;
  avgScore: number;
  accuracy: number;
  negatives: number;
  avgTime: number;
}

interface SubjectDeepDiveProps {
  data?: SubjectStats[];
}

// 🔥 FIX: Mapped strictly to your Global Semantic Subject Colors
const subjectColors: Record<string, string> = {
  Physics: "var(--subject-physics)",
  Chemistry: "var(--subject-chemistry)",
  Mathematics: "var(--subject-maths)",
};

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ data = [] }) => {
  const isEmpty = !data || data.length === 0;
  const dummyData: SubjectStats[] = [
    { subject: "Physics", avgScore: 65, accuracy: 82, negatives: 4, avgTime: 2.1 },
    { subject: "Chemistry", avgScore: 80, accuracy: 91, negatives: 2, avgTime: 1.5 },
    { subject: "Mathematics", avgScore: 40, accuracy: 68, negatives: 8, avgTime: 3.5 },
  ];

  const subjectsToRender = isEmpty ? dummyData : data;

  return (
    <AnalyticsCard
      title="Subject Breakdown"
      subtitle="Performance across Physics, Chemistry & Mathematics"
    >
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${isEmpty ? styles.blurredChart : ""}`} role="list" aria-label="Subject performance breakdown">
          {subjectsToRender.map((sub) => {
            // Fallback to text-primary if an unknown subject is passed
            const color = subjectColors[sub.subject] || "var(--text-primary)";
            const remaining = Math.max(0, 100 - sub.accuracy);

            const donutData = [
              { id: "accuracy", value: sub.accuracy, color },
              { id: "remaining", value: remaining, color: "rgba(255,255,255,0.05)" },
            ];

            return (
              <div key={sub.subject} className={styles.subjectCard} role="listitem">
                {/* Header */}
                <div className={styles.cardHeader}>
                  <h3 className={styles.subjectName}>{sub.subject}</h3>
                </div>

                {/* Donut Chart */}
                <div className={styles.donutWrapper}>
                  <div className={styles.donutChart}>
                    <ResponsivePie
                      data={donutData}
                      theme={analyticsChartTheme}
                      innerRadius={0.72}
                      padAngle={0}
                      cornerRadius={0}
                      activeOuterRadiusOffset={3}
                      colors={({ data: d }) => d.color}
                      enableArcLabels={false}
                      enableArcLinkLabels={false}
                      isInteractive={false}
                      motionConfig="gentle"
                    />
                  </div>
                  <div className={styles.donutCenter}>
                    <span className={styles.donutPercent} style={{ color }}>
                      {sub.accuracy}%
                    </span>
                    <span className={styles.donutLabel}>accuracy</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className={styles.metricsRow}>
                  <div className={styles.metric}>
                    <FiTarget size={13} aria-hidden="true" />
                    <span className={styles.metricLabel}>Accuracy</span>
                    <span className={styles.metricValue} style={{ color }}>
                      {sub.accuracy}%
                    </span>
                  </div>
                  <div className={styles.metric}>
                    <FiMinusCircle size={13} aria-hidden="true" />
                    <span className={styles.metricLabel}>Negatives</span>
                    <span className={styles.metricValue} style={{ color: "var(--color-error-main)" }}>
                      -{sub.negatives}
                    </span>
                  </div>
                  <div className={styles.metric}>
                    <FiClock size={13} aria-hidden="true" />
                    <span className={styles.metricLabel}>Avg Time</span>
                    <span className={styles.metricValue}>
                      {sub.avgTime}s
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isEmpty && (
          <div className={styles.emptyOverlay}>
            <div className={styles.emptyIconBox} aria-hidden="true">
              <FiLock size={22} />
            </div>
            <span className={styles.emptyTitle}>Subject Breakdown Locked</span>
            <span className={styles.emptySub}>Take a test to see subject analytics</span>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};