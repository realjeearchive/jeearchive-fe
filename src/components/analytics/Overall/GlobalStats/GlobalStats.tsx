"use client";

import React from "react";
import { FiActivity, FiTarget, FiCheckCircle, FiClock } from "react-icons/fi";
import styles from "./GlobalStats.module.css";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  subtitle: string;
  ringPercent: number;
}

const StatItem = ({ label, value, icon: Icon, accent, subtitle, ringPercent }: StatItemProps) => {
  const isDashed = value === "--";
  const clampedPercent = Math.min(100, Math.max(0, ringPercent));
  const ringCircumference = 2 * Math.PI * 15;
  const ringOffset = isDashed
    ? ringCircumference
    : ringCircumference - (clampedPercent / 100) * ringCircumference;

  return (
    <article className={styles.statItem} aria-label={`${label}: ${value}`}>
      {/* Top: icon + label */}
      <div className={styles.statTop}>
        <div className={styles.iconBox} style={{ background: `${accent}18`, color: accent }} aria-hidden="true">
          <Icon size={14} />
        </div>
        <span className={styles.statLabel}>{label}</span>
      </div>

      {/* Value + subtitle */}
      <div className={styles.statBottom}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statSubtitle}>{subtitle}</span>
      </div>

      {/* Mini ring indicator */}
      <div className={styles.ringWrap} aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" className={styles.ring}>
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2.5"
          />
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
        </svg>
      </div>
    </article>
  );
};

interface GlobalStatsProps {
  data: {
    testsTaken: number;
    avgScore: number;
    accuracy: number;
    avgTime: number;
  };
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ data }) => {
  const isZero = data.testsTaken === 0;

  const testsRingPercent = Math.min(100, (data.testsTaken / 20) * 100);
  const scoreRingPercent = isZero ? 0 : (data.avgScore / 300) * 100;
  const accuracyRingPercent = isZero ? 0 : data.accuracy;
  const timeRingPercent = isZero ? 0 : Math.max(0, 100 - (data.avgTime / 120) * 100); // Inverse ring, assuming 120s is average limit

  const stats = [
    {
      label: "Tests Taken",
      value: data.testsTaken,
      icon: FiActivity,
      accent: "#F59E0B",
      subtitle: isZero ? "No tests yet" : "+2 this month",
      ringPercent: testsRingPercent,
    },
    {
      label: "Avg Score",
      value: isZero ? 0 : data.avgScore,
      icon: FiTarget,
      accent: "#3B82F6",
      subtitle: isZero ? "out of 300" : "out of 300",
      ringPercent: scoreRingPercent,
    },
    {
      label: "Accuracy",
      value: isZero ? "0%" : `${data.accuracy}%`,
      icon: FiCheckCircle,
      accent: "#10b981",
      subtitle: isZero ? "0% accuracy" : data.accuracy > 70 ? "Above average" : "Needs attention",
      ringPercent: accuracyRingPercent,
    },
    {
      label: "Avg Time/Q",
      value: isZero ? 0 : `${data.avgTime}s`,
      icon: FiClock,
      accent: "#8b5cf6",
      subtitle: isZero ? "0s" : "Per question speed",
      ringPercent: timeRingPercent,
    },
  ];

  return (
    <div className={styles.container} role="list" aria-label="Global statistics">
      {stats.map((stat) => (
        <div key={stat.label} role="listitem">
          <StatItem {...stat} />
        </div>
      ))}
    </div>
  );
};