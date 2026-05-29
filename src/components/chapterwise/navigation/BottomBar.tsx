"use client";

import React from "react";
import styles from "./BottomBar.module.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  mainActionText: string;
  onMainAction: () => void;
  mainActionDisabled?: boolean;
  warningMessage?: string;
}

export const BottomBar = ({
  onNext,
  onPrev,
  disablePrev,
  disableNext,
  mainActionText,
  onMainAction,
  mainActionDisabled,
  warningMessage,
}: BottomBarProps) => {
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

        {/* DYNAMIC MAIN ACTION BUTTON WITH TOOLTIP WRAPPER */}
        <div className={styles.mainActionWrapper}>
          {/* The Tooltip */}
          {warningMessage && (
            <div className={styles.warningTooltip} role="alert">
              <FiAlertCircle size={14} aria-hidden="true" />
              {warningMessage}
            </div>
          )}

          <button
            className={`${styles.navButton} ${styles.mainAction} ${mainActionDisabled ? styles.mainActionDisabled : ""}`}
            onClick={onMainAction}
            aria-label={mainActionText}
          >
            {mainActionText.includes("Back") ? (
              <FiArrowLeft size={16} aria-hidden="true" />
            ) : (
              <FiCheckCircle size={16} aria-hidden="true" />
            )}
            <span>{mainActionText}</span>
          </button>
        </div>

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