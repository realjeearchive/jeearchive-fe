"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./MarksInfoBar.module.css";

export function MarksInfoBar() {
  // Get both the section ID and the active question ID
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const activeQuestionId = useTestEngineStore((s) => s.activeQuestionId);
  const sections = useTestEngineStore((s) => s.sections);

  if (!activeSectionId || !sections.length) return null;

  const section = sections.find((s) => s.id === activeSectionId);
  if (!section || !section.questions.length) return null;

  // --- FIX: Get the CURRENT question, not just the first one ---
  const activeQuestion = section.questions.find((q) => q.id === activeQuestionId);

  // Fallback to first question only if active is missing (safety check)
  const displayQuestion = activeQuestion || section.questions[0];

  return (
    <div className={styles.root}>
      <span className={styles.left}>
        Question Type: <strong>{displayQuestion.kind === 'single' ? 'Multiple Choice' : 'Numerical Value'}</strong>
      </span>

      <span className={styles.right}>
        Marks for correct answer:{" "}
        <strong className={styles.positive}>
          +{displayQuestion.correctMarks}
        </strong>{" "}
        | Negative Marks:{" "}
        <strong className={styles.negative}>
          {/* Ensure it displays with the logic you prefer (e.g. -1) */}
          {displayQuestion.negativeMarks}
        </strong>
      </span>
    </div>
  );
}