"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiBookOpen, FiTarget, FiMinusCircle, FiClock } from "react-icons/fi";
import styles from "./SubjectDeepDive.module.css";

export interface SubjectStats {
  subject: string;
  avgScore: number;
  accuracy: number;
  negatives: number;
  avgTime: number;
}

interface SubjectDeepDiveProps {
  data?: SubjectStats[]; 
}

export const SubjectDeepDive: React.FC<SubjectDeepDiveProps> = ({ data = [] }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className={styles.container}>
      {isEmpty ? (
        ["Physics", "Chemistry", "Mathematics"].map((subject) => (
          <AnalyticsCard title="" key={subject} className={styles.cardMinHeight}>
             <div className={styles.emptyState}>
               <FiBookOpen size={18} className={styles.emptyIcon} />
               <span className={styles.emptyText}>Awaiting data</span>
             </div>
          </AnalyticsCard>
        ))
      ) : (
        data.map((sub) => (
          <div key={sub.subject} className={styles.subjectCard}>
            
            {/* Header: Subject & Score */}
            <div className={styles.cardHeader}>
              <h3 className={styles.subjectName}>{sub.subject}</h3>
              <div className={styles.scoreBlock}>
                <span className={styles.score}>{sub.avgScore}</span>
                <span className={styles.maxScore}>/100</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${Math.min(sub.avgScore, 100)}%` }} 
              />
            </div>

            {/* Footer: Micro-metrics in sleek pills */}
            <div className={styles.metricsFooter}>
              <div className={styles.metricPill}>
                <FiTarget size={12} className={styles.metricIcon} />
                <span>{sub.accuracy}%</span>
              </div>
              <div className={styles.metricPill}>
                <FiMinusCircle size={12} className={styles.metricIcon} />
                <span>-{sub.negatives}</span>
              </div>
              <div className={styles.metricPill}>
                <FiClock size={12} className={styles.metricIcon} />
                <span>{sub.avgTime}m</span>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
};