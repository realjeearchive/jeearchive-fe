"use client";

import React from "react";
import styles from "./DifficultyAnalysis.module.css";

const DATA = [
  {
    level: "Easy",
    correct: 25,
    total: 30,
    color: "#22c55e",
    badgeClass: styles.badgeEasy,
  },
  {
    level: "Medium",
    correct: 15,
    total: 25,
    color: "#f59e0b",
    badgeClass: styles.badgeMed,
  },
  {
    level: "Hard",
    correct: 4,
    total: 20,
    color: "#ef4444",
    badgeClass: styles.badgeHard,
  },
];

export const DifficultyAnalysis = () => {
  return (
    <section className={styles.cardContainer} aria-label="Difficulty level breakdown">
      <div className={styles.header}>
        <h3 className={styles.title}>Difficulty Level Breakdown</h3>
      </div>

      <div className={styles.grid} role="list">
        {DATA.map((item) => {
          const acc = Math.round((item.correct / item.total) * 100);
          return (
            <div key={item.level} className={styles.column} role="listitem" aria-label={`${item.level}: ${item.correct} of ${item.total} solved, ${acc}% accuracy`}>
              <span className={`${styles.badge} ${item.badgeClass}`}>
                {item.level}
              </span>

              <div>
                <span className={styles.score}>{item.correct}</span>
                <span className={styles.total}>/{item.total} Solved</span>
              </div>

              <div className={styles.accuracyRow}>
                <span className={styles.accuracyValue} style={{ color: item.color }}>
                  {acc}%
                </span>
                <span className={styles.accuracyLabel}>Acc.</span>
              </div>

              <div className={styles.miniBar}>
                <div
                  className={styles.miniBarFill}
                  style={{ width: `${acc}%`, backgroundColor: item.color }}
                  role="progressbar"
                  aria-valuenow={acc}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${acc}% accuracy`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};