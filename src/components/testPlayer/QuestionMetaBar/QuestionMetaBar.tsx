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
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <span className={styles.questionNo}>
          Question No. {questionNumber}
        </span>
        <span className={styles.questionId}>
          #{questionId}
        </span>
      </div>

      <button
        type="button"
        className={styles.scrollBtn}
        onClick={handleScrollDown}
        aria-label="Scroll to bottom"
      >
        <FaArrowDownLong />
      </button>
    </div>
  );
}
