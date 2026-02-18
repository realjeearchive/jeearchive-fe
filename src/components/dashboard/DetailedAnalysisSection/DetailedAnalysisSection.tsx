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
  const handleClick = () => {
    if (!disabled && onViewAnalysis) onViewAnalysis();
  };

  return (
    <section className={`${styles.section} ${disabled ? styles.disabledSection : ''}`}>
      <div className={styles.card} onClick={handleClick}>
        {!disabled && <div className={styles.accent} />}

        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.titleRow}>
              <div className={`${styles.iconCircle} ${disabled ? styles.iconDisabled : ''}`}>
                {disabled ? <FiLock size={14} /> : <FiBarChart2 className={styles.icon} />}
              </div>
              <div className={styles.textBlock}>
                <span className={styles.title}>
                  {disabled ? "Detailed Analysis (Locked)" : "Detailed test analysis"}
                </span>
                <span className={styles.subtitle}>
                  {disabled 
                    ? "Complete at least one mock test to unlock insights." 
                    : "See trends across accuracy, speed, and topics before you start the next test."}
                </span>
              </div>
            </div>
          </div>

          {!disabled && (
            <div className={styles.metaRow}>
              <div className={styles.badges}>
                <span className={styles.badge}>Last 5 tests</span>
                <span className={styles.badge}>Topic-wise breakdown</span>
              </div>

              <button type="button" className={styles.cta}>
                <span>Open detailed analysis</span>
                <FiArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DetailedAnalysisSection;