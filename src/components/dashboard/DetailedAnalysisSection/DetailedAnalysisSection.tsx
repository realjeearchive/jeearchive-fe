"use client";

import React from "react";
import styles from "./DetailedAnalysisSection.module.css";
import { FiBarChart2, FiArrowRight } from "react-icons/fi";

interface DetailedAnalysisSectionProps {
  onViewAnalysis?: () => void;
}

const DetailedAnalysisSection: React.FC<DetailedAnalysisSectionProps> = ({
  onViewAnalysis,
}) => {
  const handleClick = () => {
    if (onViewAnalysis) onViewAnalysis();
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.titleRow}>
            <FiBarChart2 className={styles.icon} />
            <span className={styles.title}>Go deeper with detailed analysis.</span>
          </div>
          <p className={styles.subtitle}>
            Break down every test by subject, topic, time spent, and accuracy to
            decide what to study next.
          </p>
        </div>

        <div className={styles.middle}>
          <div className={styles.statBlock}>
            <span className={styles.statValue}>5</span>
            <span className={styles.statLabel}>Recent tests</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statValue}>12</span>
            <span className={styles.statLabel}>Weak topics flagged</span>
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.cta}
            onClick={handleClick}
          >
            <span>Open detailed analysis</span>
            <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DetailedAnalysisSection;
