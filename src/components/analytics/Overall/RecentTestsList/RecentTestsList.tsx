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
      <AnalyticsCard title="Recent Activity">
        <div className={styles.emptyState}>
          <FiClock size={16} className={styles.emptyIcon} aria-hidden="true" />
          <span>No recent tests</span>
        </div>
      </AnalyticsCard>
    );
  }

  return (
    <AnalyticsCard title="Recent Activity">
      <div className={styles.list} role="list">
        {data.map((test, index) => (
          <div key={`${test.id}-${index}`} className={styles.row} role="listitem">
            <div className={styles.info}>
              <span className={styles.title}>{test.title}</span>
              <span className={styles.meta}>{test.date}</span>
            </div>

            <div className={styles.right}>
              <span className={styles.score}>
                {test.score}<span className={styles.max}>/{test.totalMarks}</span>
              </span>

              <button
                className={styles.btn}
                onClick={() => router.push(`/analytics/tests/${test.id}`)}
                title="View Analytics"
                aria-label={`View analytics for ${test.title}`}
              >
                <FiBarChart2 size={13} aria-hidden="true" />
              </button>

              <button
                className={styles.btn}
                onClick={() => router.push(`/solutions/${test.id}`)}
                title="View Solutions"
                aria-label={`View solutions for ${test.title}`}
              >
                <FiBookOpen size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};