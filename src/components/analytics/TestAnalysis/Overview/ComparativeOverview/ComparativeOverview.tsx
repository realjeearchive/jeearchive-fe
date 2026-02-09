"use client";

import React from "react";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { OVERVIEW_COMPARISON } from "@/features/analytics/dummyData";
import styles from "./ComparativeOverview.module.css";

const ComparisonBar = ({ label, value, max, color, isYou = false }: { label: string, value: number, max: number, color: string, isYou?: boolean }) => (
  <div className={styles.comparisonBar}>
    <div className={styles.barHeader}>
      <span className={isYou ? styles.barLabelYou : styles.barLabel}>
        {label}
      </span>
      <span className={styles.barValue}>{value}</span>
    </div>
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBarFill} 
        style={{ 
          width: `${(value / max) * 100}%`, 
          backgroundColor: color, 
          boxShadow: isYou ? `0 0 10px ${color}40` : 'none' 
        }}
      />
    </div>
  </div>
);

export const ComparativeOverview = () => {
  const { score } = OVERVIEW_COMPARISON;
  const maxScore = 300;

  return (
    <AnalyticsCard title="Benchmarking" subtitle="Vs. Competition" className="h-full bg-[#211f1c] border-[var(--dashboard-sidebar-border-color)]">
      <div className={styles.mainContainer}>
        <ComparisonBar 
          label="YOU" 
          value={score.you} 
          max={maxScore} 
          color="#F59E0B" 
          isYou={true}
        />
        <ComparisonBar 
          label="TOPPER" 
          value={score.topper} 
          max={maxScore} 
          color="#22C55E" 
        />
        <ComparisonBar 
          label="AVERAGE" 
          value={score.average} 
          max={maxScore} 
          color="#525252" 
        />
        
        {/* Insight Footer */}
        <div className={styles.insightFooter}>
           <p className={styles.insightText}>
            <span className={styles.insightBold}>Insight:</span> You trail the topper by <span className={styles.insightNegative}>-{score.topper - score.you} marks</span>.
           </p>
        </div>
      </div>
    </AnalyticsCard>
  );
};
