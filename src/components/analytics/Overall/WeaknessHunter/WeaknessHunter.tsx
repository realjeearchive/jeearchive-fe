"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { WEAK_CHAPTERS } from "@/features/analytics/dummyData";
import styles from "./WeaknessHunter.module.css";

export const WeaknessHunter = () => {
  return (
    <AnalyticsCard title="Weakness Hunter" subtitle="Priority chapters to revise">
      <div className={styles.container}>
        {WEAK_CHAPTERS.map((chapter) => (
          <div 
            key={chapter.id} 
            className={styles.chapterItem}
          >
            <div className={styles.chapterLeftSection}>
              <div className={styles.chapterName}>
                {chapter.name}
              </div>
              <div className={styles.chapterMeta}>
                <span className={styles.subjectLabel}>
                  {chapter.subject}
                </span>
                
                {/* Badge Style */}
                {chapter.weightage === "High" && (
                  <span className={styles.highWeightageBadge}>
                    HIGH WTG
                  </span>
                )}
              </div>
            </div>
            
            <div className={styles.chapterRightSection}>
              <div className={styles.accuracyRow}>
                <span className={styles.accuracyValue}>
                  {chapter.accuracy}%
                </span>
                {/* Dot Indicator */}
                <div className={styles.dotIndicator}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};