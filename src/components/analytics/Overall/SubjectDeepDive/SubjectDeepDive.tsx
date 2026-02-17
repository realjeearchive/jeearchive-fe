"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiClock, FiAlertTriangle, FiBookOpen } from "react-icons/fi";
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
  data?: SubjectStats[]; 
}

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ data = [] }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className={styles.container}>
      {isEmpty ? (
        // --- EMPTY STATE: Show 3 Ghost Cards ---
        ["Physics", "Chemistry", "Mathematics"].map((subject) => (
          <AnalyticsCard key={subject} title={subject} className={styles.cardMinHeight}>
             <div className={styles.emptyState}>
               <div className={styles.emptyIconBox}>
                 <FiBookOpen size={20} />
               </div>
               <span className={styles.emptyText}>No data yet</span>
             </div>
          </AnalyticsCard>
        ))
      ) : (
        // --- POPULATED STATE ---
        data.map((sub) => {
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
        })
      )}
    </div>
  );
};