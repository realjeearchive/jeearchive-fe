"use client";

import styles from "./QuestionMetaBar.module.css";
import { FaArrowDownLong } from "react-icons/fa6";

interface QuestionMetaBarProps {
  questionNumber: number;
}

export function QuestionMetaBar({
  questionNumber,
}: QuestionMetaBarProps) {
  
  const handleScrollDown = () => {
    const scrollContainer = document.getElementById('question-content-area');
    if (scrollContainer) {
       scrollContainer.scrollTo({ 
         top: scrollContainer.scrollHeight, 
         behavior: 'smooth' 
       });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <span className={styles.questionNo}>
          Question No. {questionNumber}
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