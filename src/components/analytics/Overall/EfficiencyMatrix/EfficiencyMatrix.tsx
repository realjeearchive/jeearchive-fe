"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiTarget, FiHash, FiTrendingUp, FiTrendingDown, FiAlertCircle } from "react-icons/fi";
import styles from "./EfficiencyMatrix.module.css";

interface EfficiencyData {
  mcqAcc: number;
  numAcc: number;
  leakage: number;
  momentum: number;
}

interface EfficiencyMatrixProps {
  data: EfficiencyData;
}

export const EfficiencyMatrix: React.FC<EfficiencyMatrixProps> = ({ data }) => {
  const isZero = data.mcqAcc === 0 && data.numAcc === 0 && data.leakage === 0 && data.momentum === 0;

  return (
    <AnalyticsCard 
      title="Format Strategy" 
      subtitle="Accuracy by question type & score trend"
    >
      <div className={`${styles.matrixGrid} ${isZero ? styles.gridZero : ''}`}>
        
        {/* MCQ Accuracy */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>MCQ Accuracy</span>
            <FiTarget size={14} className={styles.iconBlue} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.mcqAcc}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.mcqAcc}%`, backgroundColor: '#3B82F6' }} />
            </div>
            <p className={styles.contextText}>Single Correct Questions</p>
          </div>
        </div>

        {/* Numerical Accuracy */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Numerical Accuracy</span>
            <FiHash size={14} className={styles.iconPurple} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.numAcc}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.numAcc}%`, backgroundColor: '#8B5CF6' }} />
            </div>
            <p className={styles.contextText}>Integer Type Questions</p>
          </div>
        </div>

        {/* Score Leakage */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Score Leakage</span>
            <FiAlertCircle size={14} className={styles.iconRed} />
          </div>
          <div className={styles.cardBody}>
            <div className={`${styles.mainStat} ${styles.textRed}`}>
              -{data.leakage}
            </div>
            <div className={styles.divider}></div>
            <p className={styles.contextText}>Avg. marks lost to negatives</p>
          </div>
        </div>

        {/* Score Momentum */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Score Momentum</span>
            {data.momentum >= 0 ? (
              <FiTrendingUp size={14} className={styles.iconGreen} />
            ) : (
              <FiTrendingDown size={14} className={styles.iconOrange} />
            )}
          </div>
          <div className={styles.cardBody}>
            <div className={`${styles.mainStat} ${data.momentum >= 0 ? styles.textGreen : styles.textOrange}`}>
              {data.momentum > 0 ? '+' : ''}{data.momentum}
            </div>
            <div className={styles.divider}></div>
            <p className={styles.contextText}>Trend vs. previous tests</p>
          </div>
        </div>

        {isZero && (
          <div className={styles.emptyOverlay}>
            <span>Take more tests to unlock format analytics</span>
          </div>
        )}

      </div>
    </AnalyticsCard>
  );
};