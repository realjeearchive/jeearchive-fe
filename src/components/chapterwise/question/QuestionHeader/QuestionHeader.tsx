import React from "react";
import styles from "./QuestionHeader.module.css";
import { FiCheckCircle } from "react-icons/fi"; // 🔥 Import the checkmark

interface QuestionHeaderProps {
  qNumber: number;
  type: string;
  isSolved?: boolean; // 🔥 New prop to trigger the badge
}

export const QuestionHeader = ({ qNumber, type, isSolved }: QuestionHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.qBadge}>Q{qNumber}</div>
        <div className={styles.metaPill}>{type}</div>
      </div>

      {/* 🔥 The exact LeetCode-style Solved Badge */}
      {isSolved && (
        <div className={styles.solvedBadge}>
          <span>Solved</span>
          <FiCheckCircle className={styles.solvedIcon} />
        </div>
      )}
    </div>
  );
};