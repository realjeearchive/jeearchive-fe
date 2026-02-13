import React from "react";
import styles from "./QuestionMain.module.css";
import { FiAlertCircle } from "react-icons/fi";

interface QuestionMainProps {
  children: React.ReactNode;
  status?: "correct" | "incorrect" | "unattempted";
  // Removed chapter/topic props from here as they are now used in QuestionMeta
}

export const QuestionMain = ({ children, status }: QuestionMainProps) => {
  return (
    <div className={styles.container}>
      
      {/* 1. Unattempted Banner */}
      {status === "unattempted" && (
        <div className={styles.banner}>
          <FiAlertCircle size={16} />
          You did not attempt this question
        </div>
      )}

      {/* 2. Main Children (Header, Text, Options, Meta, Solution, Stats) */}
      {children}

    </div>
  );
};