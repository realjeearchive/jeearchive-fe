"use client";

import React from "react";
import { FiActivity, FiTarget, FiCheckCircle, FiCpu } from "react-icons/fi";
import styles from "./GlobalStats.module.css";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  subtitle: string;
  ringPercent: number; // 0-100 for the ring fill
}

const StatItem = ({ label, value, icon: Icon, accent, subtitle, ringPercent }: StatItemProps) => {
  const isDashed = value === "--";
  const clampedPercent = Math.min(100, Math.max(0, ringPercent));
  const ringCircumference = 2 * Math.PI * 15;
  const ringOffset = isDashed
    ? ringCircumference
    : ringCircumference - (clampedPercent / 100) * ringCircumference;

  return (
    <div className={styles.statItem}>
      {/* Top: icon + label */}
      <div className={styles.statTop}>
        <div className={styles.iconBox} style={{ background: `${accent}18`, color: accent }}>
          <Icon size={14} />
        </div>
        <span className={styles.statLabel}>{label}</span>
      </div>

      {/* Value + subtitle */}
      <div className={styles.statBottom}>
        <span className={styles.statValue}>{value}</span>
        {isDashed ? (
          <span className={styles.statSubtitle}>&mdash;</span>
        ) : (
          <span className={styles.statSubtitle}>{subtitle}</span>
        )}
      </div>

      {/* Mini ring indicator */}
      <div className={styles.ringWrap}>
        <svg width="40" height="40" viewBox="0 0 40 40" className={styles.ring}>
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2.5"
          />
          {!isDashed && (
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 20 20)"
              className={styles.ringProgress}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

interface GlobalStatsProps {
  data: {
    testsTaken: number;
    avgScore: number;
    accuracy: number;
    consistency: number;
  };
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ data }) => {
  const isZero = data.testsTaken === 0;

  // Data-driven ring percentages
  const testsRingPercent = Math.min(100, (data.testsTaken / 20) * 100); // 20 tests = full ring
  const scoreRingPercent = isZero ? 0 : (data.avgScore / 300) * 100;     // 300 = full ring
  const accuracyRingPercent = isZero ? 0 : data.accuracy;                  // 100% = full ring
  const consistencyRingPercent = isZero ? 0 : data.consistency;            // 100 = full ring (assuming 0-100 scale)

  const stats = [
    {
      label: "Tests Taken",
      value: data.testsTaken,
      icon: FiActivity,
      accent: "#F59E0B",
      subtitle: "+2 this month",
      ringPercent: testsRingPercent,
    },
    {
      label: "Avg Score",
      value: isZero ? "--" : data.avgScore,
      icon: FiTarget,
      accent: "#3B82F6",
      subtitle: isZero ? "" : "out of 300",
      ringPercent: scoreRingPercent,
    },
    {
      label: "Accuracy",
      value: isZero ? "--" : `${data.accuracy}%`,
      icon: FiCheckCircle,
      accent: "#10b981",
      subtitle: isZero ? "" : data.accuracy > 70 ? "Above average" : "Needs attention",
      ringPercent: accuracyRingPercent,
    },
    {
      label: "Consistency",
      value: isZero ? "--" : data.consistency,
      icon: FiCpu,
      accent: "#8b5cf6",
      subtitle: isZero ? "" : "Score stability",
      ringPercent: consistencyRingPercent,
    },
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
};