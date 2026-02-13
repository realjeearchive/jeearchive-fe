"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiClock, FiAlertTriangle } from "react-icons/fi";
import styles from "./SubjectDeepDive.module.css";

// Define the shape of a single subject's data
export interface SubjectStats {
  subject: string;
  avgScore: number;
  accuracy: number;
  negatives: number;
  avgTime: number; // in minutes
}

interface SubjectDeepDiveProps {
  data?: SubjectStats[]; // Optional for now to prevent breaking if not passed immediately
}

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ data = [] }) => {
  // Fallback if data is empty (prevents crash)
  if (!data || data.length === 0) {
    return <div className={styles.container}>No subject data available.</div>;
  }

  return (
    <div className={styles.container}>
      {data.map((sub) => {
        const color = 
          sub.subject === "Physics" ? "#60A5FA" : 
          sub.subject === "Chemistry" ? "#34D399" : 
          "#FB7185"; 

        return (
          <AnalyticsCard key={sub.subject} title={sub.subject} className={styles.cardMinHeight}>
            <div className={styles.cardContent}>
              
              <div className={styles.topRow}>
                <div>
                   <div className={styles.scoreValue}>
                    <span className={styles.scoreMain}>{sub.avgScore}</span>
                    <span className={styles.scoreTotal}>/100</span>
                   </div>
                   <p className={styles.scoreLabel}>Avg Score</p>
                </div>

                <div className={styles.accuracySection}>
                  <div className={styles.accuracyValue} style={{ color }}>
                    {sub.accuracy}%
                  </div>
                  <p className={styles.accuracyLabel}>Accuracy</p>
                </div>
              </div>

              <div className={styles.bottomRow}>
                <div className={styles.negativePill}>
                  <FiAlertTriangle size={12} className={styles.negativePillIcon} />
                  <span className={styles.negativePillText}>-{sub.negatives}</span>
                </div>

                <div className={styles.timePill}>
                  <FiClock size={12} className={styles.timePillIcon} />
                  <span className={styles.timePillText}>{sub.avgTime}m</span>
                </div>
              </div>

            </div>
          </AnalyticsCard>
        );
      })}
    </div>
  );
};