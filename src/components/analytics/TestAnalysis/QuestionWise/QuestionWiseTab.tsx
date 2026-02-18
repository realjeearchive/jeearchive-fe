"use client";

import React from "react";
import styles from "./QuestionWiseTab.module.css";
import { FiList } from "react-icons/fi";

export const QuestionWiseTab = () => {
  return (
    <div className={styles.container}>
      <div className={styles.placeholderCard}>
        <div className={styles.iconWrapper}>
          <FiList size={32} />
        </div>
        <h3 className={styles.title}>Question Wise Analysis Coming Soon</h3>
        <p className={styles.subtitle}>
          Granular question-level breakdown with filters for difficulty, subject, and status is being developed.
          <br />Stay tuned!
        </p>
      </div>
    </div>
  );
};
