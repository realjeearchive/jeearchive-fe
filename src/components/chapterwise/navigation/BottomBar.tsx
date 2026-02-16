import React from "react";
import styles from "./BottomBar.module.css";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export const BottomBar = ({ onNext, onPrev, disablePrev, disableNext }: BottomBarProps) => {

  // NEW: Scroll Handler
  const handleViewSolution = () => {
    const solutionSection = document.getElementById("detailed-solution-section");
    if (solutionSection) {
      solutionSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.navGroup}>
        {/* PREVIOUS BUTTON */}
        <button 
          className={styles.navButton} 
          onClick={onPrev}
          disabled={disablePrev}
          title="Previous Question"
        >
          <FiChevronLeft size={18} /> 
          <span className={styles.btnText}>Previous</span>
        </button>

        {/* MAIN ACTION: VIEW SOLUTION */}
        <button 
          className={`${styles.navButton} ${styles.mainAction}`}
          onClick={handleViewSolution} // <--- Attached Handler
        >
          <FiEye size={16} /> 
          <span>View Solution</span>
        </button>

        {/* NEXT BUTTON */}
        <button 
          className={styles.navButton} 
          onClick={onNext}
          disabled={disableNext}
          title="Next Question"
        >
          <span className={styles.btnText}>Next</span> 
          <FiChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};