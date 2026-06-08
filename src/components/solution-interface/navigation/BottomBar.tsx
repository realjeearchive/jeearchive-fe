import React from "react";
import styles from "./BottomBar.module.css";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export const BottomBar = ({
  onNext,
  onPrev,
  disablePrev,
  disableNext,
}: BottomBarProps) => {
  const handleViewSolution = () => {
    const solutionSection = document.getElementById("detailed-solution-section");
    if (solutionSection) {
      solutionSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav className={styles.container} aria-label="Question navigation">
      <div className={styles.navGroup}>
        <button
          className={styles.navButton}
          onClick={onPrev}
          disabled={disablePrev}
          title="Previous Question"
          aria-label="Go to previous question"
        >
          <FiChevronLeft size={18} aria-hidden="true" />
          <span className={styles.btnText}>Previous</span>
        </button>

        <button
          className={`${styles.navButton} ${styles.mainAction}`}
          onClick={handleViewSolution}
          aria-label="Scroll to solution"
        >
          <FiEye size={16} aria-hidden="true" />
          <span>View Solution</span>
        </button>

        <button
          className={styles.navButton}
          onClick={onNext}
          disabled={disableNext}
          title="Next Question"
          aria-label="Go to next question"
        >
          <span className={styles.btnText}>Next</span>
          <FiChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};