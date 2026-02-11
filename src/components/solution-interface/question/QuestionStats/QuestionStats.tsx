import React from "react";
import styles from "./QuestionStats.module.css";

interface QuestionStatsProps {
  userTime: string; // "45s"
  avgTime: string;  // "1m 10s"
  accuracy: number; // 45% (global accuracy)
}

export const QuestionStats = ({ userTime, avgTime, accuracy }: QuestionStatsProps) => {
  
  // Logic for color
  let accColorClass = styles.bgAvg;
  if (accuracy > 70) accColorClass = styles.bgGood;
  if (accuracy < 40) accColorClass = styles.bgBad;

  return (
    <div className={styles.grid}>
      
      {/* Time Stats */}
      <div className={styles.statCard}>
        <div className={styles.header}>Time Spent</div>
        <div className={styles.valueRow}>
          <span className={styles.mainValue}>{userTime}</span>
          <span className={styles.subValue}>vs Avg: {avgTime}</span>
        </div>
      </div>

      {/* Accuracy Stats */}
      <div className={styles.statCard}>
        <div className={styles.header}>
          <span>Global Accuracy</span>
          <span>{accuracy}%</span>
        </div>
        <div className={styles.barContainer}>
          <div 
            className={`${styles.barFill} ${accColorClass}`} 
            style={{ width: `${accuracy}%` }} 
          />
        </div>
        <div className={styles.subValue} style={{ marginTop: 8 }}>
          {accuracy}% of students got this right.
        </div>
      </div>

    </div>
  );
};