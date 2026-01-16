"use client";

import styles from "./QuestionMetaBar.module.css";
import { FaArrowDownLong, FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface QuestionMetaBarProps {
  questionNumber: number;
  isBookmarked: boolean;       // Changed from questionId
  onToggleBookmark: () => void; // New handler
}

export function QuestionMetaBar({
  questionNumber,
  isBookmarked,
  onToggleBookmark,
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
        
        {/* NEW: Bookmark Button instead of ID */}
        <button 
          className={`${styles.bookmarkBtn} ${isBookmarked ? styles.active : ''}`}
          onClick={onToggleBookmark}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark this question"}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
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