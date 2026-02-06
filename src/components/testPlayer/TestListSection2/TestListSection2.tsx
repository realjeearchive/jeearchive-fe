"use client";

import React from "react";
import { FiChevronRight, FiPlay, FiBarChart2, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import { Loader } from "@/components/ui/loader"; 
import styles from "./TestListSection2.module.css";

export interface TestListItem {
  id: string;
  title: string;
  meta: string;
  href: string; 
}

export interface TestStatusData {
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED" | null;
  testId?: string;
}

interface TestListSectionProps {
  heading: string;
  items: TestListItem[];
  
  // State from parent
  expandedId: string | null;
  loadingId: string | null;
  currentTestStatus: TestStatusData | null;

  // Actions
  onToggleExpand: (id: string) => void;
  onStart: (paperId: string) => void;
  onResume: (paperId: string, sessionId: string) => void;
  onRestart: (paperId: string) => void;
  onViewAnalytics: (paperId: string) => void; 
  onViewSolutions: (paperId: string) => void;
}

const TestListSection2: React.FC<TestListSectionProps> = ({ 
  heading, 
  items, 
  expandedId,
  loadingId,
  currentTestStatus,
  onToggleExpand,
  onStart,
  onResume,
  onRestart,
  onViewAnalytics,
  onViewSolutions
}) => {

  const renderButtons = (item: TestListItem) => {
    if (loadingId === item.id) {
      return (
        <div className={styles.loadingContainer}>
          <Loader size="h-4 w-4" /> 
          <span>Checking status...</span>
        </div>
      );
    }

    const status = currentTestStatus?.status;
    const existingSessionId = currentTestStatus?.testId;

    // --- CASE 1: Test Completed ---
    if (status === "COMPLETED") {
      return (
        <div className={styles.actionsGrid}>
          {/* Primary: Analytics */}
          <button 
            className={`${styles.actionBtn} ${styles.btnPrimary}`}
            onClick={() => onViewAnalytics(item.id)}
          >
            <FiBarChart2 /> Analytics
          </button>
          
          {/* Secondary: Solutions */}
          <button 
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() => onViewSolutions(item.id)}
          >
            <FiBookOpen /> Solutions
          </button>

          {/* Secondary: Restart */}
          <button 
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() => onRestart(item.id)}
          >
            <FiRefreshCw /> Restart
          </button>
        </div>
      );
    }

    // --- CASE 2: In Progress / Paused ---
    if ((status === "IN_PROGRESS" || status === "PAUSED") && existingSessionId) {
      return (
        <div className={styles.actionsGrid}>
          <button 
            className={`${styles.actionBtn} ${styles.btnPrimary}`}
            onClick={() => onResume(item.id, existingSessionId)}
          >
            <FiPlay /> Resume Test
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.btnSecondary}`}
            onClick={() => onRestart(item.id)}
          >
            <FiRefreshCw /> Restart
          </button>
        </div>
      );
    }

    // --- CASE 3: Never Attempted (Default) ---
    return (
      <div className={styles.actionsGrid}>
        <button 
          className={`${styles.actionBtn} ${styles.btnPrimary}`}
          onClick={() => onStart(item.id)}
        >
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

      <div className={styles.list}>
        {items.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className={styles.itemContainer}>
              {/* Clickable Header Row */}
              <div 
                className={`${styles.row} ${isExpanded ? styles.rowActive : ''}`}
                onClick={() => onToggleExpand(item.id)}
              >
                <div className={styles.left}>
                  <span className={styles.dot} />
                  <div className={styles.textBlock}>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.meta}>{item.meta}</span>
                  </div>
                </div>

                <FiChevronRight 
                  className={`${styles.chevron} ${isExpanded ? styles.chevronActive : ''}`} 
                />
              </div>

              {/* Expandable Dropdown Content */}
              {isExpanded && (
                <div className={styles.dropdown}>
                  {renderButtons(item)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TestListSection2;