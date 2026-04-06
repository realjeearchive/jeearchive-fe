"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import styles from "./WeaknessHunter.module.css";

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
      <div className={styles.list}>
        {hasData ? (
          data.map((chapter, index) => (
            <div key={`${chapter.chapter}-${index}`} className={styles.row}>
              
              <div className={styles.left}>
                {/* Subtle dot indicator for high priority */}
                <div className={`${styles.dot} ${chapter.weightage === 'High' ? styles.dotAlert : ''}`} />
                <div className={styles.textStack}>
                  <span className={styles.chapter}>{chapter.chapter}</span>
                  <span className={styles.subject}>{chapter.subject}</span>
                </div>
              </div>

              <div className={styles.right}>
                <span className={styles.accuracy}>{chapter.accuracy}%</span>
              </div>

            </div>
          ))
        ) : (
          <div className={styles.empty}>No weakness data yet</div>
        )}
      </div>
    </AnalyticsCard>
  );
};