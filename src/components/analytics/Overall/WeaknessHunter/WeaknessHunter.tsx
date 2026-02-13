"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import styles from "./WeaknessHunter.module.css";

export interface WeaknessItem {
  chapter: string;
  subject: string;
  accuracy: number;
  weightage?: string; // Optional
}

interface WeaknessHunterProps {
  data: WeaknessItem[];
}

export const WeaknessHunter: React.FC<WeaknessHunterProps> = ({ data }) => {
  return (
    <AnalyticsCard title="Weakness Hunter" subtitle="Priority chapters to revise">
      <div className={styles.container}>
        {data.length > 0 ? (
          data.map((chapter, index) => (
            <div 
              key={`${chapter.chapter}-${index}`} 
              className={styles.chapterItem}
            >
              <div className={styles.chapterLeftSection}>
                <div className={styles.chapterName}>
                  {chapter.chapter}
                </div>
                <div className={styles.chapterMeta}>
                  <span className={styles.subjectLabel}>
                    {chapter.subject}
                  </span>
                  
                  {/* Logic: Show High Wtg badge if passed, or if accuracy is critically low (<40%) implies high priority */}
                  {(chapter.weightage === "High" || chapter.accuracy < 40) && (
                    <span className={styles.highWeightageBadge}>
                      HIGH PRIORITY
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.chapterRightSection}>
                <div className={styles.accuracyRow}>
                  <span className={styles.accuracyValue}>
                    {chapter.accuracy}%
                  </span>
                  {/* Dot Indicator Color Logic */}
                  <div 
                    className={styles.dotIndicator}
                    style={{ backgroundColor: chapter.accuracy < 40 ? '#EF4444' : '#F59E0B' }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--dashboard-secondary-text-color)', fontSize: 13 }}>
            No critical weaknesses found in this range.
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};