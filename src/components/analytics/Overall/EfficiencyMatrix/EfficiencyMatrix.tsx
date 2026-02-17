"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle, FiActivity } from "react-icons/fi";
import styles from "./EfficiencyMatrix.module.css";

interface EfficiencyData {
  fastCorrect: number;
  slowCorrect: number;
  fastWrong: number;
  slowWrong: number;
}

interface EfficiencyMatrixProps {
  data: EfficiencyData;
}

export const EfficiencyMatrix: React.FC<EfficiencyMatrixProps> = ({ data }) => {
  // Check if data is empty (all zeros)
  const isZero = Object.values(data).every(val => val === 0);

  return (
    <AnalyticsCard 
      title="Speed vs. Accuracy" 
      subtitle="Efficiency Breakdown"
      headerAction={
        !isZero && (
          <div className={styles.headerBadge}>
            <FiActivity size={12} /> 
            <span>Score: 72/100</span>
          </div>
        )
      }
    >
      <div className={`${styles.matrixGrid} ${isZero ? styles.gridZero : ''}`}>
        
        {/* Quadrant 1: Fast & Correct */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Fast & Correct</span>
            <FiCheckCircle size={14} className={styles.iconGreen} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.fastCorrect}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.fastCorrect}%`, backgroundColor: '#22C55E' }} />
            </div>
            <p className={styles.contextText}>Ideal zone</p>
          </div>
        </div>

        {/* Quadrant 2: Slow & Correct */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Slow & Correct</span>
            <FiClock size={14} className={styles.iconBlue} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.slowCorrect}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.slowCorrect}%`, backgroundColor: '#3B82F6' }} />
            </div>
            <p className={styles.contextText}>Needs speed</p>
          </div>
        </div>

        {/* Quadrant 3: Fast & Wrong */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Fast & Wrong</span>
            <FiAlertTriangle size={14} className={styles.iconOrange} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.fastWrong}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.fastWrong}%`, backgroundColor: '#F59E0B' }} />
            </div>
            <p className={styles.contextText}>Rushing?</p>
          </div>
        </div>

        {/* Quadrant 4: Slow & Wrong */}
        <div className={styles.matrixCard}>
          <div className={styles.cardHeader}>
            <span className={styles.statusLabel}>Slow & Wrong</span>
            <FiXCircle size={14} className={styles.iconRed} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.slowWrong}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${data.slowWrong}%`, backgroundColor: '#EF4444' }} />
            </div>
            <p className={styles.contextText}>Concept gap</p>
          </div>
        </div>

        {/* EMPTY STATE OVERLAY */}
        {isZero && (
          <div className={styles.emptyOverlay}>
            <span>Not enough data to calculate efficiency</span>
          </div>
        )}

      </div>
    </AnalyticsCard>
  );
};