"use client";

import React from "react";
import styles from "./PerformanceTab.module.css";
import { FiLayers } from "react-icons/fi";

export const PerformanceTab = () => {
  return (
    <main className={styles.container} aria-label="Performance analysis">
      <div className={styles.placeholderCard}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <FiLayers size={32} />
        </div>
        <h3 className={styles.title}>Performance Analysis Coming Soon</h3>
        <p className={styles.subtitle}>
          We are building advanced insights to help you track score potential
          and difficulty breakdowns.
          <br />
          Stay tuned for the next update!
        </p>
      </div>
    </main>
  );
};