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
  return (
    <AnalyticsCard 
      title="Speed vs. Accuracy" 
      subtitle="Efficiency Breakdown"
      headerAction={<div className={styles.headerBadge}><FiActivity /> Efficiency Score: 72/100</div>}
    >
      <div className={styles.matrixGrid}>
        
        {/* Quadrant 1: Fast & Correct */}
        <div className={`${styles.matrixCard} ${styles.cardGreen}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.bgGreen}`}>
              <FiCheckCircle size={16} />
            </div>
            <span className={`${styles.statusBadge} ${styles.textGreen}`}>Fast & Correct</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.fastCorrect}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillGreen} style={{ width: `${data.fastCorrect}%` }} />
            </div>
            <p className={styles.contextText}>Perfect execution zone</p>
          </div>
        </div>

        {/* Quadrant 2: Slow & Correct */}
        <div className={`${styles.matrixCard} ${styles.cardBlue}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.bgBlue}`}>
              <FiClock size={16} />
            </div>
            <span className={`${styles.statusBadge} ${styles.textBlue}`}>Slow & Correct</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.slowCorrect}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillBlue} style={{ width: `${data.slowCorrect}%` }} />
            </div>
            <p className={styles.contextText}>Needs speed improvement</p>
          </div>
        </div>

        {/* Quadrant 3: Fast & Wrong */}
        <div className={`${styles.matrixCard} ${styles.cardOrange}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.bgOrange}`}>
              <FiAlertTriangle size={16} />
            </div>
            <span className={`${styles.statusBadge} ${styles.textOrange}`}>Fast & Wrong</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.fastWrong}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillOrange} style={{ width: `${data.fastWrong}%` }} />
            </div>
            <p className={styles.contextText}>Likely guessing or silly errors</p>
          </div>
        </div>

        {/* Quadrant 4: Slow & Wrong */}
        <div className={`${styles.matrixCard} ${styles.cardRed}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBox} ${styles.bgRed}`}>
              <FiXCircle size={16} />
            </div>
            <span className={`${styles.statusBadge} ${styles.textRed}`}>Slow & Wrong</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainStat}>
              {data.slowWrong}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillRed} style={{ width: `${data.slowWrong}%` }} />
            </div>
            <p className={styles.contextText}>Critical conceptual gaps</p>
          </div>
        </div>

      </div>
    </AnalyticsCard>
  );
};