"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useRouter } from "next/navigation";
import styles from "./TestSubmissionSummary.module.css";

export function TestSubmissionSummary() {
  const { sections, questionsById, title, submitTest } = useTestEngineStore();
  const router = useRouter();

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

  const handleFinalSubmit = () => {
    submitTest();
    router.push("/dashboard");
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Exact Banner from Image 3 */}
      <header className={styles.topBanner}>
        {title.toUpperCase()} UPDATED AS PER LATEST NTA PATTERN
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
            <button className={styles.noBtn} onClick={() => router.back()}>
              No! Go Back to Paper
            </button>
            <button className={styles.yesBtn} onClick={handleFinalSubmit}>
              Yes! Submit the Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}