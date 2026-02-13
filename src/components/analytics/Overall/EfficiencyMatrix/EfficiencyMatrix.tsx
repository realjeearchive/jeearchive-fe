"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle, FiActivity } from "react-icons/fi";
import styles from "./EfficiencyMatrix.module.css";

// Dummy data structure
const EFFICIENCY_DATA = {
  fastCorrect: { value: 45, label: "Ideal", status: "good" },
  slowCorrect: { value: 20, label: "Too Slow", status: "warning" },
  fastWrong: { value: 15, label: "Rushing", status: "danger" },
  slowWrong: { value: 20, label: "Gap", status: "critical" }
};

export const EfficiencyMatrix = () => {
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
              {EFFICIENCY_DATA.fastCorrect.value}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillGreen} style={{ width: `${EFFICIENCY_DATA.fastCorrect.value}%` }} />
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
              {EFFICIENCY_DATA.slowCorrect.value}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillBlue} style={{ width: `${EFFICIENCY_DATA.slowCorrect.value}%` }} />
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
              {EFFICIENCY_DATA.fastWrong.value}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillOrange} style={{ width: `${EFFICIENCY_DATA.fastWrong.value}%` }} />
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
              {EFFICIENCY_DATA.slowWrong.value}<span className={styles.percent}>%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.fillRed} style={{ width: `${EFFICIENCY_DATA.slowWrong.value}%` }} />
            </div>
            <p className={styles.contextText}>Critical conceptual gaps</p>
          </div>
        </div>

      </div>
    </AnalyticsCard>
  );
};