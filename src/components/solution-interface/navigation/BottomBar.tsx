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

        {/* MAIN ACTION */}
        <button className={`${styles.navButton} ${styles.mainAction}`}>
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