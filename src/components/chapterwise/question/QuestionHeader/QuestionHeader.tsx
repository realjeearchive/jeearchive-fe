import React from "react";
import styles from "./QuestionHeader.module.css";
import { FiBookmark, FiAlertTriangle, FiClock } from "react-icons/fi";

interface QuestionHeaderProps {
  qNumber: number;
  type: string;
  marksPos: number;
  marksNeg: number;
  timer: string; // <--- New Prop
}

export const QuestionHeader = ({ 
  qNumber, 
  type, 
  marksPos, 
  marksNeg,
  timer 
}: QuestionHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.qBadge}>Q{qNumber}</div>
        <div className={styles.metaPill}>{type}</div>
      </div>

      <div className={styles.rightSection}>
        {/* TIMER BLOCK */}
        <div className={styles.timerBlock}>
          <span>{timer}</span>
          <FiClock size={14} />
        </div>

        <div className={styles.divider} />

        <div className={styles.marksBlock}>
          <span className={styles.posMark}>+{marksPos}</span>
          <span> / </span>
          <span className={styles.negMark}>-{marksNeg}</span>
        </div>
        
        <button className={styles.actionBtn}>
          <FiBookmark size={13} /> <span className={styles.btnText}>Bookmark</span>
        </button>
        <button className={`${styles.actionBtn} ${styles.reportBtn}`}>
          <FiAlertTriangle size={13} /> <span className={styles.btnText}>Report</span>
        </button>
      </div>
    </div>
  );
};