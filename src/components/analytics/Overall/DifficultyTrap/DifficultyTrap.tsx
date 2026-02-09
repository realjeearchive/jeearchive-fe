"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { DIFFICULTY_STRATEGY } from "@/features/analytics/dummyData";
import { FiAlertCircle } from "react-icons/fi";
import styles from "./DifficultyTrap.module.css";

interface TrapBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const TrapBar = ({ label, count, total, color }: TrapBarProps) => (
  <div className={styles.trapBarContainer}>
    <div className={styles.trapBarHeader}>
      <span className={styles.trapBarLabel}>
        {label}
      </span>
      <span className={styles.trapBarCount}>
        {count} <span className={styles.trapBarCountUnit}>Qs</span>
      </span>
    </div>
    
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBarFill} 
        style={{ 
          width: `${Math.min((count / total) * 100, 100)}%`, 
          background: color, // Solid color for cleaner look on dark bg
          boxShadow: `0 0 8px ${color}30`
        }} 
      />
    </div>
  </div>
);

export const DifficultyTrap = () => {
  return (
    <AnalyticsCard title="Selection Strategy" subtitle="Where marks are leaking">
      <div className={styles.mainContainer}>
        
        <TrapBar 
          label="Easy Questions Missed" 
          count={DIFFICULTY_STRATEGY.easyMissed} 
          total={100} 
          color="#EF4444" 
        />
        
        <TrapBar 
          label="Tough Qs (Wrong Attempt)" 
          count={DIFFICULTY_STRATEGY.toughAttempted} 
          total={50} 
          color="#F59E0B" 
        />

        {/* Insight Footer - Styled like a dashboard badge/alert */}
        <div className={styles.insightFooter}>
          <div className={styles.insightIcon}><FiAlertCircle size={14} /></div>
          <p className={styles.insightText}>
            <span className={styles.insightTextBold}>Quick Win:</span> Fixing the <span className={styles.insightTextHighlight}>24 easy misses</span> is your fastest path to +12 marks.
          </p>
        </div>

      </div>
    </AnalyticsCard>
  );
};