import React from "react";
import styles from "./QuestionMain.module.css";
import { FiAlertCircle, FiTarget } from "react-icons/fi"; // Added FiTarget for the button icon

interface QuestionMainProps {
  children: React.ReactNode;
  status?: "correct" | "incorrect" | "unattempted";
  topic?: string;
  chapter?: string;
}

export const QuestionMain = ({ children, status, topic, chapter }: QuestionMainProps) => {
  return (
    <div className={styles.container}>
      
      {/* 1. Unattempted Banner */}
      {status === "unattempted" && (
        <div className={styles.banner}>
          <FiAlertCircle size={16} />
          You did not attempt this question
        </div>
      )}

      {/* 2. Main Children */}
      {children}

      {/* 3. Footer Meta Info */}
      {(chapter || topic) && (
        <div className={styles.footer}>
          <div className={styles.footerLabel}>
            Chapter & Topic
          </div>
          
          <div className={styles.footerContent}>
            {chapter} 
            <span className={styles.separator}>•</span> 
            {topic}
          </div>
          
          <div className={styles.footerBtnWrapper}>
            <button className={styles.attemptBtn}>
              <FiTarget size={14} /> Attempt Similar Qs
            </button>
          </div>
        </div>
      )}

    </div>
  );
};