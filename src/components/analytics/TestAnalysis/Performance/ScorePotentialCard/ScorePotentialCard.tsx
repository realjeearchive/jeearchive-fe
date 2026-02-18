"use client";

import React from "react";
import styles from "./ScorePotentialCard.module.css";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";

export const ScorePotentialCard = () => {
  const { myScore, totalMarks } = SINGLE_TEST_DATA.meta;
  const { negativeScore } = SINGLE_TEST_DATA.stats;
  
  const sillyMistakesLoss = 15; 
  const potentialScore = myScore + Math.abs(negativeScore) + sillyMistakesLoss;
  
  const maxDisplay = potentialScore * 1.1; 
  
  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Score Potential Analysis</h3>
          <p className={styles.subtitle}>Actual Score vs What was possible</p>
        </div>
      </div>

      <div className={styles.visualContainer}>
        <div className={styles.barWrapper}>
          <div 
            className={`${styles.segment} ${styles.segmentActual}`} 
            style={{ width: `${(myScore / maxDisplay) * 100}%` }} 
          />
          <div 
            className={`${styles.segment} ${styles.segmentNegative}`} 
            style={{ width: `${(Math.abs(negativeScore) / maxDisplay) * 100}%` }} 
          />
          <div 
            className={`${styles.segment} ${styles.segmentMissed}`} 
            style={{ width: `${(sillyMistakesLoss / maxDisplay) * 100}%` }} 
          />
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span className={styles.dot} style={{ background: 'var(--dashboard-core-color)' }} />
            Actual
          </span>
          <span className={styles.statValue}>{myScore}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span className={styles.dot} style={{ background: '#EF4444' }} />
            Lost (Neg)
          </span>
          <span className={styles.statValue}>-{Math.abs(negativeScore)}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span className={styles.dot} style={{ background: '#3f3f46' }} />
            Easy Misses
          </span>
          <span className={styles.statValue}>{sillyMistakesLoss}</span>
          <span className={styles.statSub}>Recoverable</span>
        </div>
      </div>

      <div className={styles.insight}>
        You scored <strong>{myScore}</strong>, but your true potential was <strong className="text-white">{potentialScore}</strong>. 
        Avoiding negatives and silly errors in easy questions would have boosted your rank by <span className={styles.insightHighlight}>~1,200</span>.
      </div>
    </div>
  );
};
