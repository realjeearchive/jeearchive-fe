"use client";

import React from "react";
import styles from "./SolutionHeader.module.css";
import {
  FiArrowLeft,
  FiSettings,
  FiMenu,
  FiPlayCircle,
  FiPauseCircle,
  FiBookmark,
  FiAlertTriangle,
  FiClock, // 🔥 NEW ICON for History
} from "react-icons/fi";
import { TbMathFunction, TbAtom, TbFlask } from "react-icons/tb";
import { FileText } from "lucide-react";

interface SolutionHeaderProps {
  testName: string;
  activeSubject: "Physics" | "Chemistry" | "Mathematics";
  onSubjectChange?: (subject: "Physics" | "Chemistry" | "Mathematics") => void;
  onBack: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  mode?: "solution" | "practice";
  activeTab: "question" | "solution" | "history"; // 🔥 NEW: Support History tab
  onTabChange: (tab: "question" | "solution" | "history") => void;
  isCurrentQuestionSubmitted: boolean;
  timer?: string;
  isTimerRunning?: boolean;
  onToggleTimer?: () => void;
  marksPos?: number;
  marksNeg?: number;
  showTools?: boolean;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  showTimerPrompt?: boolean;
}

export const SolutionHeader = ({
  testName,
  activeSubject,
  onSubjectChange,
  onBack,
  isSidebarOpen,
  onToggleSidebar,
  mode = "solution",
  activeTab,
  onTabChange,
  isCurrentQuestionSubmitted,
  timer,
  isTimerRunning,
  onToggleTimer,
  marksPos,
  marksNeg,
  showTools,
  isBookmarked,
  onBookmark,
  showTimerPrompt,
}: SolutionHeaderProps) => {
  const getTabsRowClass = () => {
    if (activeTab === "solution" || activeTab === "history")
      return `${styles.tabsRow} ${styles.tabsRowSolution}`;
    switch (activeSubject) {
      case "Mathematics": return `${styles.tabsRow} ${styles.tabsRowMath}`;
      case "Physics": return `${styles.tabsRow} ${styles.tabsRowPhy}`;
      case "Chemistry": return `${styles.tabsRow} ${styles.tabsRowChem}`;
      default: return styles.tabsRow;
    }
  };

  const renderSubjectTab = (
    subject: "Physics" | "Chemistry" | "Mathematics",
    Icon: React.ElementType
  ) => {
    const isSubjectActive = activeSubject === subject;
    if (mode === "practice" && !isSubjectActive) return null;

    return (
      <button
        key={subject}
        className={`${styles.tab} ${subject === "Mathematics" ? styles.tabMath : subject === "Physics" ? styles.tabPhy : styles.tabChem} ${activeTab === "question" ? styles.active : ""}`}
        onClick={() => onTabChange("question")}
        aria-pressed={activeTab === "question" && isSubjectActive}
      >
        <Icon className={styles.tabIcon} aria-hidden="true" />
        <span>{subject}</span>
      </button>
    );
  };

  return (
    <header className={styles.container} role="banner">
      <div className={styles.topRow}>
        <div className={styles.leftSection}>
          <button onClick={onBack} className={styles.backBtn} aria-label="Go back">
            <FiArrowLeft size={20} aria-hidden="true" />
          </button>
          <div className={styles.titleBlock}>
            <h1 className={styles.mainTitle}>
              {mode === "practice" ? "Chapter Practice" : "Solutions"}
            </h1>
            <span className={styles.subTitle}>{testName}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isSidebarOpen && (
            <button
              className={styles.settingsBtn}
              onClick={onToggleSidebar}
              aria-label="Open question panel"
            >
              <FiMenu size={14} aria-hidden="true" /> <span>Question Panel</span>
            </button>
          )}
        </div>
      </div>

      <nav className={getTabsRowClass()} aria-label="Subject and solution tabs">
        {renderSubjectTab("Mathematics", TbMathFunction)}
        {renderSubjectTab("Physics", TbAtom)}
        {renderSubjectTab("Chemistry", TbFlask)}

        {isCurrentQuestionSubmitted && (
          <>
            <button
              className={`${styles.tab} ${styles.tabSolution} ${activeTab === "solution" ? styles.active : ""}`}
              onClick={() => onTabChange("solution")}
              aria-pressed={activeTab === "solution"}
            >
              <FileText className={styles.tabIcon} size={16} strokeWidth={2} aria-hidden="true" />
              <span>Solutions</span>
            </button>
            
            {/* 🔥 NEW: History Tab */}
            <button
              className={`${styles.tab} ${styles.tabSolution} ${activeTab === "history" ? styles.active : ""}`}
              onClick={() => onTabChange("history")}
              aria-pressed={activeTab === "history"}
            >
              <FiClock className={styles.tabIcon} size={16} strokeWidth={2} aria-hidden="true" />
              <span>History</span>
            </button>
          </>
        )}

        {showTools && (
          <div className={styles.toolsContainer}>
            <div className={styles.timerWrapper}>
              <button
                onClick={onToggleTimer}
                className={`${styles.timerBlock} ${!isTimerRunning ? styles.timerPaused : ""}`}
                title={isTimerRunning ? "Pause Timer" : "Start Timer"}
              >
                <span>{timer || "00:00"}</span>
                {isTimerRunning ? <FiPauseCircle size={16} aria-hidden="true" /> : <FiPlayCircle size={16} aria-hidden="true" />}
              </button>

              {showTimerPrompt && !isTimerRunning && (
                <div className={styles.timerPrompt} role="status">Click to start timer</div>
              )}
            </div>

            <div className={styles.divider} aria-hidden="true" />

            <div className={styles.marksBlock}>
              <span className={styles.posMark}>+{marksPos}</span>
              <span style={{ color: "var(--dashboard-secondary-text-color)" }}> / </span>
              <span className={styles.negMark}>-{marksNeg}</span>
            </div>

            <button
              className={`${styles.actionBtn} ${isBookmarked ? styles.activeBookmark : ""}`}
              onClick={onBookmark}
            >
              <FiBookmark size={13} fill={isBookmarked ? "currentColor" : "none"} aria-hidden="true" />
              <span className={styles.btnText}>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button className={`${styles.actionBtn} ${styles.reportBtn}`} aria-label="Report this question">
              <FiAlertTriangle size={13} aria-hidden="true" />{" "}
              <span className={styles.btnText}>Report</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};