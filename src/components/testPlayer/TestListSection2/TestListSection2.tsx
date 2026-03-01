"use client";

import React from "react";
import { FiPlay, FiBarChart2, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import styles from "./TestListSection2.module.css";

export interface TestCardItem {
  id: string;      // paperId
  title: string;
  meta: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PAUSED" | "NOT_ATTEMPTED";
  sessionId?: string; // latestAttempt.testId
}

interface TestListSectionProps {
  heading: string;
  items: TestCardItem[];

  // Actions
  onStart: (paperId: string) => void;
  onResume: (paperId: string, sessionId: string) => void;
  onRestart: (paperId: string) => void;
  onViewAnalytics: (paperId: string) => void; 
  onViewSolutions: (paperId: string) => void;
}

const TestListSection2: React.FC<TestListSectionProps> = ({ 
  heading, 
  items, 
  onStart,
  onResume,
  onRestart,
  onViewAnalytics,
  onViewSolutions
}) => {

  const renderButtons = (item: TestCardItem) => {
    // --- CASE 1: Test Completed ---
    if (item.status === "COMPLETED") {
      return (
        <div className={styles.actionsGroup}>
          <button className={`${styles.actionBtn} ${styles.btnPrimary}`} onClick={() => onViewAnalytics(item.id)}>
            <FiBarChart2 /> Analytics
          </button>
          <button className={`${styles.actionBtn} ${styles.btnSecondary}`} onClick={() => onViewSolutions(item.id)}>
            <FiBookOpen /> Solutions
          </button>
          <button className={`${styles.actionBtn} ${styles.btnSecondary}`} onClick={() => onRestart(item.id)}>
            <FiRefreshCw /> Restart
          </button>
        </div>
      );
    }

    // --- CASE 2: In Progress / Paused ---
    if ((item.status === "IN_PROGRESS" || item.status === "PAUSED") && item.sessionId) {
      return (
        <div className={styles.actionsGroup}>
          <button className={`${styles.actionBtn} ${styles.btnPrimary}`} onClick={() => onResume(item.id, item.sessionId!)}>
            <FiPlay /> Resume Test
          </button>
          <button className={`${styles.actionBtn} ${styles.btnSecondary}`} onClick={() => onRestart(item.id)}>
            <FiRefreshCw /> Restart
          </button>
        </div>
      );
    }

    // --- CASE 3: Never Attempted (Default) ---
    return (
      <div className={styles.actionsGroup}>
        <button className={`${styles.actionBtn} ${styles.btnPrimary}`} onClick={() => onStart(item.id)}>
          <FiPlay /> Take Test
        </button>
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.cardGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={`${styles.dot} ${item.status === 'COMPLETED' ? styles.dotCompleted : item.status === 'IN_PROGRESS' || item.status === 'PAUSED' ? styles.dotActive : ''}`} />
              <div className={styles.textBlock}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.meta}>{item.meta}</span>
              </div>
            </div>
            <div className={styles.cardFooter}>
              {renderButtons(item)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestListSection2;