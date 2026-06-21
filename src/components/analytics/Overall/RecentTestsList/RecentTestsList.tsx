"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiBarChart2, FiBookOpen, FiClock, FiLock, FiChevronDown } from "react-icons/fi";
import AllRecentTestsPopup from "@/components/popups/AllRecentTestsPopup/AllRecentTestsPopup";
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const hasData = !isEmpty && data && data.length > 0;

  const dummyData: RecentTestUI[] = [
    { id: "1", title: "Full Syllabus Mock Test 1", meta: "JEE Advanced Pattern", status: "COMPLETED", score: 120, totalMarks: 360, date: "2 days ago" },
    { id: "2", title: "Physics Part Test", meta: "Mains Pattern", status: "COMPLETED", score: 45, totalMarks: 100, date: "5 days ago" },
    { id: "3", title: "Chemistry Part Test", meta: "Mains Pattern", status: "COMPLETED", score: 70, totalMarks: 100, date: "1 week ago" }
  ];

  const listData = hasData ? data : dummyData;
  const displayData = listData.slice(0, 10);
  const showSeeMore = hasData && listData.length > 10;

  return (
    <AnalyticsCard title="Recent Activity">
      <div className={styles.container}>
        <div className={!hasData ? styles.blurredList : styles.list} role="list">
          {displayData.map((test, index) => (
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
                  disabled={!hasData}
                >
                  <FiBarChart2 size={14} aria-hidden="true" />
                  <span className={styles.btnText}>Analytics</span>
                </button>

                <button
                  className={styles.btn}
                  onClick={() => router.push(`/solutions/${test.id}`)}
                  title="View Solutions"
                  aria-label={`View solutions for ${test.title}`}
                  disabled={!hasData}
                >
                  <FiBookOpen size={14} aria-hidden="true" />
                  <span className={styles.btnText}>Solutions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        {!hasData && (
          <div className={styles.emptyOverlay}>
            <div className={styles.emptyIconBox} aria-hidden="true">
              <FiLock size={22} />
            </div>
            <span className={styles.emptyTitle}>Activity Locked</span>
            <span className={styles.emptySub}>Take tests to populate your history</span>
          </div>
        )}

        {showSeeMore && (
          <div className={styles.seeMoreContainer}>
            <button className={styles.seeMoreBtn} onClick={() => setIsPopupOpen(true)}>
              View Complete History <FiChevronDown size={14} />
            </button>
          </div>
        )}

        {hasData && (
          <AllRecentTestsPopup 
            isOpen={isPopupOpen} 
            onClose={() => setIsPopupOpen(false)} 
            data={listData} 
          />
        )}
      </div>
    </AnalyticsCard>
  );
};