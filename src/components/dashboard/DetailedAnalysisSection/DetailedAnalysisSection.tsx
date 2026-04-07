"use client";

import React from "react";
import styles from "./DetailedAnalysisSection.module.css";
import { FiBarChart2, FiArrowRight, FiLock } from "react-icons/fi";

interface DetailedAnalysisSectionProps {
  onViewAnalysis?: () => void;
  disabled?: boolean;
}

const DetailedAnalysisSection: React.FC<DetailedAnalysisSectionProps> = ({
  onViewAnalysis,
  disabled = false,
}) => {
  return (
    <section className={styles.section}>
      <div 
        className={`${styles.card} ${disabled ? styles.locked : ""}`}
        onClick={() => !disabled && onViewAnalysis?.()}
        role={disabled ? "presentation" : "button"}
      >
        <div className={styles.leftGroup}>
          <div className={styles.iconBox}>
            {disabled ? <FiLock size={18} /> : <FiBarChart2 size={18} />}
          </div>
          <div className={styles.textGroup}>
            <h3 className={styles.title}>
              {disabled ? "Analysis Locked" : "Detailed Test Analysis"}
            </h3>
            <p className={styles.subtitle}>
              {disabled 
                ? "Complete a mock test to unlock performance insights." 
                : "Review your accuracy, speed, and topic-wise breakdown."}
            </p>
          </div>
        </div>

        <div className={styles.rightGroup}>
          {!disabled ? (
            <div className={styles.cta}>
              <span>View Insights</span>
              <FiArrowRight className={styles.arrow} size={16} />
            </div>
          ) : (
            <div className={styles.lockedBadge}>
              Needs Test Data
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetailedAnalysisSection;