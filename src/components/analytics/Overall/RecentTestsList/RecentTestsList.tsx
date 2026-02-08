"use client";

import React, { useState } from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import TestListSection2, { TestListItem, TestStatusData } from "@/components/testPlayer/TestListSection2/TestListSection2";
import { RECENT_TESTS } from "@/features/analytics/dummyData";
import { useRouter } from "next/navigation";

export const RecentTestsList = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items: TestListItem[] = RECENT_TESTS.map((t) => ({
    id: t.id,
    title: t.title,
    meta: `${t.status === "COMPLETED" ? `Score: ${t.score}/${t.totalMarks}` : "In Progress"} • ${t.date}`,
    href: "#",
  }));

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatus = (id: string): TestStatusData => {
    const test = RECENT_TESTS.find((t) => t.id === id);
    type StatusType = TestStatusData["status"];
    return { 
      status: (test?.status as StatusType) || null, 
      testId: "dummy-session-id" 
    };
  };

  return (
    <div className="mt-4">
      <AnalyticsCard title="Recent Test Activity">
        {/* The list component handles its own internal layout, we just frame it */}
        <div className="-mx-2"> 
          <TestListSection2
            heading=""
            items={items}
            expandedId={expandedId}
            loadingId={null} 
            currentTestStatus={expandedId ? getStatus(expandedId) : null}
            onToggleExpand={handleToggle}
            onStart={(id) => console.log("Start", id)}
            onResume={(id) => console.log("Resume", id)}
            onRestart={(id) => console.log("Restart", id)}
            onViewAnalytics={(id) => router.push(`/analytics/tests/${id}`)}
            onViewSolutions={(id) => router.push(`/solutions/${id}`)}
          />
        </div>
      </AnalyticsCard>
    </div>
  );
};