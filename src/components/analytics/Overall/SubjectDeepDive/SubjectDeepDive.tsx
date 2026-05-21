"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import { FiTarget, FiMinusCircle, FiClock, FiAlertCircle } from "react-icons/fi";
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

const subjectColors: Record<string, string> = {
  Physics: "#F59E0B",
  Chemistry: "#3B82F6",
  Mathematics: "#10B981",
};

const subjectGradients: Record<string, string> = {
  Physics: "linear-gradient(135deg, #F59E0B, #D97706)",
  Chemistry: "linear-gradient(135deg, #3B82F6, #2563EB)",
  Mathematics: "linear-gradient(135deg, #10B981, #059669)",
};

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ data = [] }) => {
  const isEmpty = !data || data.length === 0;
  const defaultSubjects = ["Physics", "Chemistry", "Mathematics"];

  const subjectsToRender = isEmpty
    ? defaultSubjects.map((s) => ({ subject: s, avgScore: 0, accuracy: 0, negatives: 0, avgTime: 0 }))
    : data;

  return (
    <AnalyticsCard title="Subject Breakdown" subtitle="Performance across Physics, Chemistry & Mathematics">
      <div className={styles.container}>
        {subjectsToRender.map((sub) => {
          const color = subjectColors[sub.subject] || "#F59E0B";
          const isPlaceholder = isEmpty;
          const remaining = Math.max(0, 100 - sub.accuracy);

          const donutData = [
            { id: "accuracy", value: sub.accuracy, color },
            { id: "remaining", value: remaining, color: "rgba(255,255,255,0.05)" },
          ];

          return (
            <div key={sub.subject} className={styles.subjectCard}>
              {/* Header */}
              <div className={styles.cardHeader}>
                <h3 className={styles.subjectName}>{sub.subject}</h3>
              </div>

              {/* Donut Chart */}
              <div className={styles.donutWrapper}>
                <div className={styles.donutChart}>
                  {isPlaceholder ? (
                    <div className={styles.emptyDonut}>
                      <FiAlertCircle size={20} />
                    </div>
                  ) : (
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
                  )}
                </div>
                <div className={styles.donutCenter}>
                  <span className={styles.donutPercent} style={{ color }}>
                    {isPlaceholder ? "--" : `${sub.accuracy}%`}
                  </span>
                  <span className={styles.donutLabel}>accuracy</span>
                </div>
              </div>

              {/* Metrics */}
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <FiTarget size={13} />
                  <span className={styles.metricLabel}>Accuracy</span>
                  <span className={styles.metricValue} style={{ color }}>
                    {isPlaceholder ? "--" : `${sub.accuracy}%`}
                  </span>
                </div>
                <div className={styles.metric}>
                  <FiMinusCircle size={13} />
                  <span className={styles.metricLabel}>Negatives</span>
                  <span className={styles.metricValue} style={{ color: "#f87171" }}>
                    {isPlaceholder ? "--" : `-${sub.negatives}`}
                  </span>
                </div>
                <div className={styles.metric}>
                  <FiClock size={13} />
                  <span className={styles.metricLabel}>Avg Time</span>
                  <span className={styles.metricValue}>
                    {isPlaceholder ? "--" : `${sub.avgTime}m`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
};