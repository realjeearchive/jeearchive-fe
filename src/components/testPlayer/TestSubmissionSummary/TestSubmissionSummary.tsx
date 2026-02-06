"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./TestSubmissionSummary.module.css";
import { toast } from "sonner"; // Optional: assuming you use sonner/hot-toast

export function TestSubmissionSummary() {
  // Pull metadata and existing store data
  const { sections, questionsById, paperMetadata, submitTest } = useTestEngineStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create the dynamic formatted header with proper underscore cleaning
  const formattedHeader = useMemo(() => {
    if (!paperMetadata) return "JEE TEST UPDATED AS PER LATEST NTA PATTERN";

    const { examName, year, date, month, shift } = paperMetadata;

    // Clean "JEE_MAIN" to "JEE MAIN"
    const cleanExamName = examName?.replace(/_/g, " ") || "JEE MAIN";

    // Construct parts in proper order: Year, Date, Month, Shift
    const parts = [
      cleanExamName,
      year,
      date,
      month,
      shift ? `${shift} SHIFT` : ""
    ].filter(Boolean);

    return `${parts.join(" ").toUpperCase()} UPDATED AS PER LATEST NTA PATTERN`;
  }, [paperMetadata]);

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
      // Wait for the API call to complete
      await submitTest();
      
      // Only redirect on success
      router.push("/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
      // Optional: Show an error toast here
      toast.error("Failed to submit test. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Banner matches TopStrip formatting exactly */}
      <header className={styles.topBanner}>
        {formattedHeader}
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
                <th>ANSWERED AND MARKED FOR REVIEW (will be evaluated)</th>
                <th>NOT VISITED</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.total}</td>
                  <td>{row.answered}</td>
                  <td>{row.notAnswered}</td>
                  <td>{row.marked}</td>
                  <td>{row.answeredMarked}</td>
                  <td>{row.notVisited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.actionSection}>
          <p className={styles.promptText}>
            Are you sure wish to submit this group of questions for marking?
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
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? "Submitting..." : "Yes! Submit the Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}