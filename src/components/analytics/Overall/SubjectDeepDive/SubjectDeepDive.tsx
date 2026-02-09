"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SUBJECT_DEEP_DIVE } from "@/features/analytics/dummyData";
import { FiClock, FiAlertTriangle } from "react-icons/fi";
import styles from "./SubjectDeepDive.module.css";

export const SubjectDeepDive = () => {
  return (
    <div className={styles.container}>
      {SUBJECT_DEEP_DIVE.map((sub) => {
        // Match dashboard subject colors
        const color = 
          sub.subject === "Physics" ? "#60A5FA" : // Blue-ish
          sub.subject === "Chemistry" ? "#34D399" : // Green-ish
          "#FB7185"; // Red/Pink-ish

        return (
          <AnalyticsCard key={sub.subject} title={sub.subject} className={styles.cardMinHeight}>
             {/* Content Layout */}
            <div className={styles.cardContent}>
              
              {/* Top Row: Score & Accuracy */}
              <div className={styles.topRow}>
                <div>
                   <div className={styles.scoreValue}>
                    <span className={styles.scoreMain}>
                      {sub.avgScore}
                    </span>
                    <span className={styles.scoreTotal}>
                      /100
                    </span>
                   </div>
                   <p className={styles.scoreLabel}>
                     Avg Score
                   </p>
                </div>

                {/* Accuracy Circular/Text */}
                <div className={styles.accuracySection}>
                  <div className={styles.accuracyValue} style={{ color }}>
                    {sub.accuracy}%
                  </div>
                  <p className={styles.accuracyLabel}>
                    Accuracy
                  </p>
                </div>
              </div>

              {/* Bottom Row: Negatives & Time */}
              <div className={styles.bottomRow}>
                {/* Negatives Pill (using dashboard deltaNegative style) */}
                <div className={styles.negativePill}>
                  <FiAlertTriangle size={12} className={styles.negativePillIcon} />
                  <span className={styles.negativePillText}>-{sub.negatives}</span>
                </div>

                {/* Time Pill */}
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