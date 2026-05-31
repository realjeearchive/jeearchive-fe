"use client";

import React from "react";
import styles from "./DetailedAnalysisSection.module.css";
import { FiArrowRight, FiLock, FiActivity } from "react-icons/fi";

interface DetailedAnalysisSectionProps {
  onViewAnalysis?: () => void;
  disabled?: boolean;
}

const DetailedAnalysisSection: React.FC<DetailedAnalysisSectionProps> = ({
  onViewAnalysis,
  disabled = false,
}) => {
  return (
    <section className={styles.section} aria-label="Detailed analysis">
      <div
        className={`${styles.card} ${disabled ? styles.locked : ""}`}
        onClick={() => !disabled && onViewAnalysis?.()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && onViewAnalysis) {
            e.preventDefault();
            onViewAnalysis();
          }
        }}
        aria-disabled={disabled}
        aria-label={
          disabled
            ? "Analysis unavailable - unlock after your first test"
            : "View performance insights"
        }
      >
        <div className={styles.content}>
          <div className={styles.icon} aria-hidden="true">
            {disabled ? <FiLock /> : <FiActivity />}
          </div>
          <div className={styles.text}>
            <h3 className={styles.title}>
              {disabled ? "Analysis Unavailable" : "Performance Insights"}
            </h3>
            <p className={styles.subtitle}>
              {disabled
                ? "Unlock after your first test"
                : "Accuracy, speed, and topic breakdown"}
            </p>
          </div>
        </div>

        {!disabled && (
          <div className={styles.action} aria-hidden="true">
            <FiArrowRight />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailedAnalysisSection;