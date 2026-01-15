"use client";

import React from "react";
import styles from "./StartTestPopup.module.css";
import { FiAlertCircle, FiPlay, FiRefreshCw } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  testTitle: string;
  isResume: boolean; // Determines if we show "Resume" or "Start"
  onClose: () => void;
  onConfirm: () => void;
}

export default function StartTestPopup({
  isOpen,
  testTitle,
  isResume,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          {isResume ? <FiRefreshCw /> : <FiAlertCircle />}
        </div>
        
        <h3 className={styles.title}>
          {isResume ? "Resume Test?" : "Start Test?"}
        </h3>
        
        <p className={styles.message}>
          {isResume 
            ? `Resume your unfinished session for "${testTitle}"?`
            : `Ready to start "${testTitle}"? The timer begins immediately.`
          }
        </p>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          
          <button onClick={onConfirm} className={styles.confirmBtn}>
            {isResume ? (
              <> <FiPlay /> Resume Test </>
            ) : (
              <> <FiPlay /> Start Test </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}