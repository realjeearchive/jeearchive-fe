import React from "react";
import styles from "./QuestionMain.module.css";
import { FiAlertCircle } from "react-icons/fi";
import { QuestionStatus } from "@/features/solutions/solutionsTransformer";

interface QuestionMainProps {
  children: React.ReactNode;
  status?: QuestionStatus;
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

      {/* 2. Main Content */}
      {children}

    </div>
  );
};