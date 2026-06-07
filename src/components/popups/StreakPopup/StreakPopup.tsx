"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./StreakPopup.module.css";
import { PiFireFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

interface StreakPopupProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
}

export const StreakPopup: React.FC<StreakPopupProps> = ({ isOpen, onClose, streakCount }) => {
  const [render, setRender] = useState(isOpen);
  const [mounted, setMounted] = useState(false);

  // 🔥 FIX: Wrapped in setTimeout to prevent synchronous cascading render warning
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let renderTimer: NodeJS.Timeout;
    let autoCloseTimer: NodeJS.Timeout;

    if (isOpen) {
      // Pushes the state update to the next tick
      renderTimer = setTimeout(() => setRender(true), 0);
      
      // Auto-close after 6 seconds
      autoCloseTimer = setTimeout(() => onClose(), 6000);
    } else {
      // Delay unmount to allow exit animation to play out smoothly
      autoCloseTimer = setTimeout(() => setRender(false), 300);
    }

    return () => {
      clearTimeout(renderTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [isOpen, onClose]);

  // Prevent hydration errors by not rendering until the client has mounted
  if (!mounted || (!render && !isOpen)) return null;

  // The modal content
  const modalContent = (
    <div 
      className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`} 
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} ${isOpen ? styles.modalVisible : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <IoClose size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconRing}>
            <PiFireFill className={styles.fireIcon} />
          </div>
          <h2 className={styles.title}>Daily Goal Completed!</h2>
        </div>

        <div className={styles.streakBox}>
          <span className={styles.streakLabel}>Completion Streak:</span>
          <span className={styles.streakValue}>
            {streakCount} {streakCount === 1 ? "Day" : "Days"}
          </span>
        </div>

        <p className={styles.subtitle}>Consistency is key, see you tomorrow!</p>
      </div>
    </div>
  );

  // Mount directly to the body, bypassing all z-index traps!
  return createPortal(modalContent, document.body);
};