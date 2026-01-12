"use client";

import styles from "./QuestionMetaBar.module.css";
import { FaArrowDownLong } from "react-icons/fa6";

interface QuestionMetaBarProps {
  questionNumber: number;
  questionId: string;
}

export function QuestionMetaBar({
  questionNumber,
  questionId,
}: QuestionMetaBarProps) {
  
  const handleScrollDown = () => {
    // Scroll the question area container
    const main = document.querySelector('main');
    if (main) {
       main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <span className={styles.questionNo}>
          Question No. {questionNumber}
        </span>
        <span className={styles.questionId}>
          ID: {questionId.slice(0, 8)}...
        </span>
      </div>

      <button
        type="button"
        className={styles.scrollBtn}
        onClick={handleScrollDown}
        title="Scroll to bottom"
      >
        <FaArrowDownLong />
      </button>
    </div>
  );
}