"use client";

import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import styles from "./PercentileCard.module.css";

interface Props {
  predictedPercentile: string;
}

export const PercentileCard = ({ predictedPercentile }: Props) => {
  return (
    <div className={styles.container}>
      
      <div className={styles.bgGradient} />
      <div className={styles.bgGlowAnimated} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <FiTrendingUp size={16} />
          </div>
          <span className={styles.headerTitle}>
            Predicted Percentile
          </span>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.percentileValue}>
            {predictedPercentile}
          </div>
          <div className={styles.disclaimer}>
            <div className={styles.disclaimerDot} />
            <p className={styles.disclaimerText}>
              Estimated based on shift difficulty (27 Jan S1) and historical cutoff data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};