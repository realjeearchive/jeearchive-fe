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


  const handleViewSolution = () => {
    const solutionSection = document.getElementById("detailed-solution-section");
    if (solutionSection) {
      solutionSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.navGroup}>

        <button 
          className={styles.navButton} 
          onClick={onPrev}
          disabled={disablePrev}
          title="Previous Question"
        >
          <FiChevronLeft size={18} /> 
          <span className={styles.btnText}>Previous</span>
        </button>


        <button 
          className={`${styles.navButton} ${styles.mainAction}`}
          onClick={handleViewSolution} 
        >
          <FiEye size={16} /> 
          <span>View Solution</span>
        </button>


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