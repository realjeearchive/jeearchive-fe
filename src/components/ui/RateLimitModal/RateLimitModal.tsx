"use client";

import React from "react";
import { FiClock, FiRefreshCw } from "react-icons/fi";
import styles from "./RateLimitModal.module.css";
import { useRateLimitStore } from "@/store/useRateLimitStore";

export const RateLimitModal = () => {
  const { isRateLimited } = useRateLimitStore();

  if (!isRateLimited) return null;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <FiClock size={32} className={styles.icon} />
        </div>
        <h2 className={styles.title}>Too many requests!</h2>
        <p className={styles.description}>
          Take a short break. Refresh in a few seconds.
        </p>
        <button className={styles.refreshBtn} onClick={handleRefresh}>
          <FiRefreshCw size={16} className={styles.btnIcon} />
          Refresh Page
        </button>
      </div>
    </div>
  );
};