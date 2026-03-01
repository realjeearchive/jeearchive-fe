"use client";

import React from "react";
import Link from "next/link";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import TestListSection2, { TestCardItem } from "@/components/testPlayer/TestListSection2/TestListSection2";
import { useRouter } from "next/navigation";
import styles from "./RecentTestsList.module.css";
import { FiInbox } from "react-icons/fi";
import { RecentTestUI } from "@/features/analytics/analyticsTransformer";

interface RecentTestsListProps {
  isEmpty?: boolean;
  data?: RecentTestUI[];
}

export const RecentTestsList: React.FC<RecentTestsListProps> = ({ isEmpty = false, data = [] }) => {
  const router = useRouter();

  const hasData = !isEmpty && data && data.length > 0;

  // 🚨 FIX: Map data to TestCardItem and FORCE status to "COMPLETED"
  const items: TestCardItem[] = data.map((t) => ({
    id: t.id,
    title: t.title,
    meta: t.meta,
    status: "COMPLETED", // This forces the component to show Analytics & Solutions
    sessionId: t.id
  }));

  return (
    <div className={styles.container}>
      <AnalyticsCard title="Recent Test Activity">
        {hasData ? (
          <div className={styles.listWrapper}> 
            <TestListSection2
              heading=""
              items={items}
              hideRestart={true} // 🚨 FIX: Hides the Restart button specifically on the Analytics page
              onStart={() => {}} // Disabled here
              onResume={() => {}} // Disabled here
              onRestart={() => {}} // Disabled here
              onViewAnalytics={(id) => router.push(`/analytics/tests/${id}`)}
              onViewSolutions={(id) => router.push(`/solutions/${id}`)}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiInbox size={20} className={styles.emptyIcon} />
            <span className={styles.emptyText}>No recent tests taken</span>
            <Link href="/previous-year-questions" className={styles.startTestBtn}>
              Start New Test
            </Link>
          </div>
        )}
      </AnalyticsCard>
    </div>
  );
};