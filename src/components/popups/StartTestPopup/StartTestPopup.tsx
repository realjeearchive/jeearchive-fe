"use client";

import React, { useEffect } from "react";
import { FiAlertCircle, FiPlay, FiRefreshCw, FiX, FiRotateCcw } from "react-icons/fi";
import styles from "./StartTestPopup.module.css";

interface Props {
  isOpen: boolean;
  testTitle: string;
  isResume: boolean; 
  onClose: () => void;
  onStart: () => void;   
  onResume: () => void;  
  onRestart: () => void; 
}

export default function StartTestPopup({
  isOpen,
  testTitle,
  isResume,
  onClose,
  onStart,
  onResume,
  onRestart,
}: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.closeIconBtn} 
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className={`${styles.iconWrapper} ${isResume ? styles.resumeIcon : styles.startIcon}`}>
          {isResume ? <FiRefreshCw /> : <FiAlertCircle />}
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>
            {isResume ? "Resume Attempt?" : "Start New Test?"}
          </h3>
          
          <p className={styles.message}>
            {isResume 
              ? `You have an ongoing session for "${testTitle}". Would you like to resume where you left off or restart from the beginning?`
              : `You are about to start "${testTitle}". The timer will begin after you accept the instructions.`
            }
          </p>
        </div>

        <div className={styles.actions}>
          {isResume ? (
            <>
              <button onClick={onRestart} className={styles.restartBtn}>
                <FiRotateCcw className={styles.btnIcon} /> Restart
              </button>
              <button onClick={onResume} className={styles.resumeBtn}>
                <FiPlay className={styles.btnIcon} /> Resume
              </button>
            </>
          ) : (
            <button onClick={onStart} className={styles.startBtn}>
              <FiPlay className={styles.btnIcon} /> Start Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}