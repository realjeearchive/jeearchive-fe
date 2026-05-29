"use client";

import React from "react";
import styles from "./QuestionMain.module.css";
import { FiAlertCircle } from "react-icons/fi";

interface QuestionMainProps {
  children: React.ReactNode;
  status?: "correct" | "incorrect" | "unattempted";
}

export const QuestionMain = ({ children, status }: QuestionMainProps) => {
  return (
    <article className={styles.container} aria-label="Question content">
      {status === "unattempted" && (
        <div className={styles.banner} role="alert">
          <FiAlertCircle size={16} aria-hidden="true" />
          You did not attempt this question
        </div>
      )}
      {children}
    </article>
  );
};