"use client";

import React from "react";
import styles from "./BottomBar.module.css";
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  mainActionText: string;
  onMainAction: () => void;
  mainActionDisabled?: boolean;
  warningMessage?: string; // 🔥 NEW: Warning message prop
}

export const BottomBar = ({ 
  onNext, 
  onPrev, 
  disablePrev, 
  disableNext,
  mainActionText,
  onMainAction,
  mainActionDisabled,
  warningMessage
}: BottomBarProps) => {

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

        {/* 🔥 DYNAMIC MAIN ACTION BUTTON WITH TOOLTIP WRAPPER */}
        <div className={styles.mainActionWrapper}>
          
          {/* The Tooltip */}
          {warningMessage && (
            <div className={styles.warningTooltip}>
              <FiAlertCircle size={14} />
              {warningMessage}
            </div>
          )}

          <button 
            /* Notice we removed the native 'disabled' attribute so onClick still fires! */
            className={`${styles.navButton} ${styles.mainAction} ${mainActionDisabled ? styles.mainActionDisabled : ''}`}
            onClick={onMainAction}
          >
            {mainActionText.includes("Back") ? <FiArrowLeft size={16} /> : <FiCheckCircle size={16} />}
            <span>{mainActionText}</span>
          </button>
        </div>

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