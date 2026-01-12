"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./MarksInfoBar.module.css";

export function MarksInfoBar() {
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const sections = useTestEngineStore((s) => s.sections);

  if (!activeSectionId || !sections.length) return null;

  const section = sections.find((s) => s.id === activeSectionId);
  if (!section || !section.questions.length) return null;

  // Assume all questions in a section have the same marks (Standard NTA pattern)
  const firstQ = section.questions[0];

  return (
    <div className={styles.root}>
      <span className={styles.left}>
        Question Type: <strong>{firstQ.kind === 'single' ? 'Multiple Choice' : 'Numerical Value'}</strong>
      </span>

      <span className={styles.right}>
        Marks for correct answer:{" "}
        <strong className={styles.positive}>
          {firstQ.correctMarks}
        </strong>{" "}
        | Negative Marks:{" "}
        <strong className={styles.negative}>
          {firstQ.negativeMarks}
        </strong>
      </span>
    </div>
  );
}