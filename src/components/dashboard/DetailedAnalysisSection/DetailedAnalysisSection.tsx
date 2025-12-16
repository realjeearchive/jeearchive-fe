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
        <div className={styles.accent} />

        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.titleRow}>
              <div className={styles.iconCircle}>
                <FiBarChart2 className={styles.icon} />
              </div>
              <div className={styles.textBlock}>
                <span className={styles.title}>Detailed test analysis</span>
                <span className={styles.subtitle}>
                  See trends across accuracy, speed, and topics before you start the next test.
                </span>
              </div>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.badges}>
              <span className={styles.badge}>Last 5 tests</span>
              <span className={styles.badge}>Topic-wise breakdown</span>
            </div>

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
      </div>
    </section>
  );
};

export default DetailedAnalysisSection;
