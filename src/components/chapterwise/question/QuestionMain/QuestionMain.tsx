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
    <div className={styles.container}>
      {/* Banner logic can remain, or be removed for Practice mode if not needed */}
      {status === "unattempted" && (
        <div className={styles.banner}>
          <FiAlertCircle size={16} />
          You did not attempt this question
        </div>
      )}
      {children}
    </div>
  );
};