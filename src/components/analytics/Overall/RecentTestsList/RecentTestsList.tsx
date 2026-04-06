"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiBarChart2, FiBookOpen, FiClock } from "react-icons/fi";
import styles from "./RecentTestsList.module.css";

interface RecentTestUI {
  id: string;
  title: string;
  meta: string;
  status: "COMPLETED" | "IN_PROGRESS";
  score: number;
  totalMarks: number;
  date: string;
}

interface RecentTestsListProps {
  data: RecentTestUI[];
  isEmpty: boolean;
}

export const RecentTestsList: React.FC<RecentTestsListProps> = ({ data, isEmpty }) => {
  const router = useRouter();

  if (isEmpty || !data || data.length === 0) {
    return (
      <AnalyticsCard title="Recent Test Activity">
        <div className={styles.emptyState}>
          <FiClock size={20} className={styles.emptyIcon} />
          <span className={styles.emptyText}>No recent tests found</span>
        </div>
      </AnalyticsCard>
    );
  }

  return (
    <AnalyticsCard title="Recent Test Activity">
      <div className={styles.ledgerContainer}>
        
        {/* Optional Header Row for Context (Like a table header) */}
        <div className={styles.ledgerHeader}>
          <div className={styles.colInfo}>TEST DETAILS</div>
          <div className={styles.colScore}>FINAL SCORE</div>
          <div className={styles.colActions}>ACTIONS</div>
        </div>

        <div className={styles.listWrapper}>
          {data.map((test, index) => (
            <div key={`${test.id}-${index}`} className={styles.row}>
              
              {/* Left: Status, Title, Date */}
              <div className={styles.colInfo}>
                <div className={styles.textStack}>
                  <span className={styles.title}>{test.title}</span>
                  <span className={styles.date}>{test.date}</span>
                </div>
              </div>

              {/* Middle: Score */}
              <div className={styles.colScore}>
                <div className={styles.scoreBlock}>
                  <span className={styles.score}>{test.score}</span>
                  <span className={styles.maxScore}>/ {test.totalMarks}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className={styles.colActions}>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  onClick={() => router.push(`/analytics/tests/${test.id}`)}
                >
                  <FiBarChart2 size={12} /> <span>Analytics</span>
                </button>
                <button 
                  className={`${styles.btn} ${styles.btnSecondary}`} 
                  onClick={() => router.push(`/solutions/${test.id}`)}
                >
                  <FiBookOpen size={12} /> <span>Solutions</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
};