import React from "react";
import styles from "./QuestionHeader.module.css";
import { FiBookmark, FiAlertTriangle } from "react-icons/fi";

interface QuestionHeaderProps {
  qNumber: number | string;
  type: string;
  marksPos: number;
  marksNeg: number;
}

export const QuestionHeader = ({
  qNumber,
  type,
  marksPos,
  marksNeg,
}: QuestionHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.qBadge} aria-label={`Question ${qNumber}`}>
          Q{qNumber}
        </div>
        <div className={styles.metaPill}>{type}</div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.marksBlock}>
          <span className={styles.posMark}>+{marksPos}</span>
          <span> / </span>
          <span className={styles.negMark}>-{marksNeg}</span>
        </div>
        <button className={styles.actionBtn} aria-label="Bookmark this question">
          <FiBookmark size={13} aria-hidden="true" /> Bookmark
        </button>
        <button
          className={`${styles.actionBtn} ${styles.reportBtn}`}
          aria-label="Report this question"
        >
          <FiAlertTriangle size={13} aria-hidden="true" /> Report
        </button>
      </div>
    </div>
  );
};