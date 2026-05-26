"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { fetchDashboardData } from "@/features/dashboard/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./TestSubmissionSummary.module.css";
import { toast } from "sonner";

export function TestSubmissionSummary() {
  const { sections, questionsById, formattedBannerText, submitTest } = useTestEngineStore();
  const { setDashboardData } = useDashboardStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summaryData = sections.map((section) => {
    const sectionQuestions = section.questions;
    const stats = {
      name: section.label,
      total: sectionQuestions.length,
      answered: 0,
      notAnswered: 0,
      marked: 0,
      answeredMarked: 0,
      notVisited: 0,
    };

    sectionQuestions.forEach((q) => {
      const state = questionsById[q.id];
      if (!state) return;
      if (state.status === "answered") stats.answered++;
      else if (state.status === "notAnswered") stats.notAnswered++;
      else if (state.status === "markedForReview") stats.marked++;
      else if (state.status === "answeredAndMarked") stats.answeredMarked++;
      else if (state.status === "notVisited") stats.notVisited++;
    });

    return stats;
  });

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Submit the test first
      await submitTest();
      
      // Refresh dashboard data in background
      try {
        const dashboardResponse = await fetchDashboardData();
        if (dashboardResponse.success && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }
      } catch (dashboardError) {
        console.error("[TestPlayer: Submit] Failed to refresh dashboard data", dashboardError);
        // Don't block navigation if dashboard fetch fails
      }
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("[TestPlayer: Submit] Final submission failed in UI layer", error);
      toast.error("Submission failed. Your answers are safe — please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.topBanner}>
        {formattedBannerText || "JEE TEST UPDATED AS PER LATEST NTA PATTERN"}
      </header>
      
      <div className={styles.contentContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>SECTION NAME</th>
                <th>NO. OF QUESTIONS</th>
                <th>ANSWERED</th>
                <th>NOT ANSWERED</th>
                <th>MARKED FOR REVIEW</th>
                <th>ANSWERED & MARKED</th>
                <th>NOT VISITED</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td className={styles.centerAlign}>{row.total}</td>
                  <td className={styles.centerAlign}>{row.answered}</td>
                  <td className={styles.centerAlign}>{row.notAnswered}</td>
                  <td className={styles.centerAlign}>{row.marked}</td>
                  <td className={styles.centerAlign}>{row.answeredMarked}</td>
                  <td className={styles.centerAlign}>{row.notVisited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.actionSection}>
          <p className={styles.promptText}>
            Are you sure you wish to submit this test for marking?
          </p>
          <div className={styles.btnRow}>
            <button 
              className={styles.noBtn} 
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              No! Go Back to Paper
            </button>
            <button 
              className={styles.yesBtn} 
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Yes! Submit the Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}