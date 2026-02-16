import React from "react";
import styles from "./QuestionHeader.module.css";
import { FiBookmark, FiAlertTriangle } from "react-icons/fi";

interface QuestionHeaderProps {
  qNumber: number;
  type: string;
  marksPos: number;
  marksNeg: number;
}

export const QuestionHeader = ({ 
  qNumber, 
  type, 
  marksPos, 
  marksNeg 
}: QuestionHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.qBadge}>Q{qNumber}</div>
        <div className={styles.metaPill}>{type}</div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.marksBlock}>
          <span className={styles.posMark}>+{marksPos}</span>
          <span> / </span>
          <span className={styles.negMark}>-{marksNeg}</span>
        </div>
        <button className={styles.actionBtn}>
          <FiBookmark size={13} /> Bookmark
        </button>
        <button className={`${styles.actionBtn} ${styles.reportBtn}`}>
          <FiAlertTriangle size={13} /> Report
        </button>
      </div>
    </div>
  );
};