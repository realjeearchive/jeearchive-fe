import React from "react";
import styles from "./QuestionHeader.module.css";
import { FiCheckCircle } from "react-icons/fi";

interface QuestionHeaderProps {
  qNumber: number;
  type: string;
  isSolved?: boolean;
}

export const QuestionHeader = ({ qNumber, type, isSolved }: QuestionHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.qBadge} aria-label={`Question ${qNumber}`}>
          Q{qNumber}
        </div>
        <div className={styles.metaPill}>{type}</div>
      </div>

      {isSolved && (
        <div className={styles.solvedBadge} role="status" aria-label="Question solved">
          <span>Solved</span>
          <FiCheckCircle className={styles.solvedIcon} aria-hidden="true" />
        </div>
      )}
    </div>
  );
};