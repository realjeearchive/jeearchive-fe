"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./MarksInfoBar.module.css";

export function MarksInfoBar() {
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const sections = useTestEngineStore((s) => s.sections);

  if (!activeSectionId) return null;

  const section = sections.find((s) => s.id === activeSectionId);
  if (!section || !section.questions.length) return null;

  const firstQ = section.questions[0];
  const questionDef =
    useTestEngineStore.getState().questionsById[firstQ.id];

  return (
    <div className={styles.root}>
      <span className={styles.left}>
        Question Type: <strong>Single Correct</strong>
      </span>

      <span className={styles.right}>
        Marks for correct answer:{" "}
        <strong className={styles.positive}>
          {questionDef.correctMarks}
        </strong>{" "}
        | Negative Marks:{" "}
        <strong className={styles.negative}>
          {questionDef.negativeMarks}
        </strong>
      </span>
    </div>
  );
}
