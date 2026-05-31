"use client";

import React from "react";
import styles from "./AttemptQualityCard.module.css";
import { FiCheckCircle, FiClock, FiAlertOctagon, FiZap } from "react-icons/fi";

const QUALITY_DATA = [
  {
    id: "perfect",
    label: "Perfect Attempts",
    desc: "Correct & within time limit",
    count: 32,
    avgTime: "1m 10s",
    icon: FiCheckCircle,
    styleClass: styles.iconGreen,
    textClass: styles.textGreen,
  },
  {
    id: "overtime",
    label: "Overtime Struggles",
    desc: "Correct but too slow",
    count: 12,
    avgTime: "3m 45s",
    icon: FiClock,
    styleClass: styles.iconAmber,
    textClass: styles.textAmber,
  },
  {
    id: "wasted",
    label: "Wasted Effort",
    desc: "Spent time but got wrong",
    count: 5,
    avgTime: "4m 10s",
    icon: FiAlertOctagon,
    styleClass: styles.iconRed,
    textClass: styles.textRed,
  },
  {
    id: "rushed",
    label: "Rushed / Fluke",
    desc: "Too fast (<30s)",
    count: 4,
    avgTime: "0m 20s",
    icon: FiZap,
    styleClass: styles.iconPurple,
    textClass: styles.textPurple,
  },
];

export const AttemptQualityCard = () => {
  return (
    <section className={styles.cardContainer} aria-label="Attempt quality analysis">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Attempt Quality</h3>
          <p className={styles.subtitle}>Speed vs. Accuracy Analysis</p>
        </div>
      </div>

      <div className={styles.qualityList} role="list">
        {QUALITY_DATA.map((item) => (
          <div key={item.id} className={styles.qualityRow} role="listitem" aria-label={`${item.label}: ${item.count} attempts, average ${item.avgTime}`}>
            <div className={styles.rowLeft}>
              <div className={`${styles.iconBox} ${item.styleClass}`} aria-hidden="true">
                <item.icon size={16} />
              </div>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>{item.label}</span>
                <span className={styles.rowDesc}>{item.desc}</span>
              </div>
            </div>

            <div className={styles.rowValue}>
              <div className={styles.count}>{item.count}</div>
              <div className={styles.timeAvg}>Avg: {item.avgTime}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};