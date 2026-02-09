"use client";

import React from "react";
import styles from "./TimeAnalysisTab.module.css";
import { FiClock } from "react-icons/fi";

export const TimeAnalysisTab = () => {
  return (
    <div className={styles.container}>
      <div className={styles.placeholderCard}>
        <div className={styles.iconWrapper}>
          <FiClock size={32} />
        </div>
        <h3 className={styles.title}>Time Analysis Coming Soon</h3>
        <p className={styles.subtitle}>
          Detailed breakdowns of time spent per question and attempt quality analysis are under construction.
          <br />Check back later!
        </p>
      </div>
    </div>
  );
};