"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import styles from "./WeaknessHunter.module.css";
import { FiCheckCircle } from "react-icons/fi";

export interface WeaknessItem {
  chapter: string;
  subject: string;
  accuracy: number;
  weightage?: string;
}

interface WeaknessHunterProps {
  data: WeaknessItem[];
}

export const WeaknessHunter: React.FC<WeaknessHunterProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <AnalyticsCard title="Weakness Hunter" subtitle="Priority chapters to revise">
      <div className={styles.container}>
        {hasData ? (
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
                  <div 
                    className={styles.dotIndicator}
                    style={{ backgroundColor: chapter.accuracy < 40 ? '#EF4444' : '#F59E0B' }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FiCheckCircle size={18} className={styles.emptyIcon} />
            <span className={styles.emptyText}>
               No weakness data available yet.
            </span>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};
