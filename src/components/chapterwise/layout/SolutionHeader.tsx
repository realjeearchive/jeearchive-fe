"use client";

import React from "react";
import styles from "./SolutionHeader.module.css";
import { FiArrowLeft, FiSettings, FiMenu, FiPlayCircle, FiPauseCircle, FiBookmark, FiAlertTriangle } from "react-icons/fi";
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
  activeTab: "question" | "solution";
  onTabChange: (tab: "question" | "solution") => void;
  isCurrentQuestionSubmitted: boolean; 
  timer?: string;
  isTimerRunning?: boolean;
  onToggleTimer?: () => void;
  marksPos?: number;
  marksNeg?: number;
  showTools?: boolean;
  // 🔥 NEW: Bookmark props
  isBookmarked?: boolean;
  onBookmark?: () => void;
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
  onBookmark
}: SolutionHeaderProps) => {

  const getTabsRowClass = () => {
    if (activeTab === "solution") return `${styles.tabsRow} ${styles.tabsRowSolution}`;
    switch(activeSubject) {
      case "Mathematics": return `${styles.tabsRow} ${styles.tabsRowMath}`;
      case "Physics": return `${styles.tabsRow} ${styles.tabsRowPhy}`;
      case "Chemistry": return `${styles.tabsRow} ${styles.tabsRowChem}`;
      default: return styles.tabsRow;
    }
  };

  const renderSubjectTab = (subject: "Physics" | "Chemistry" | "Mathematics", Icon: React.ElementType) => {
    const isSubjectActive = activeSubject === subject;
    if (mode === "practice" && !isSubjectActive) return null;

    return (
      <button 
        key={subject}
        className={`${styles.tab} ${subject === "Mathematics" ? styles.tabMath : subject === "Physics" ? styles.tabPhy : styles.tabChem} ${activeTab === 'question' ? styles.active : ""}`}
        onClick={() => onTabChange("question")} 
      >
        <Icon className={styles.tabIcon} />
        <span>{subject}</span>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.leftSection}>
          <button onClick={onBack} className={styles.backBtn}>
            <FiArrowLeft size={20} />
          </button>
          <div className={styles.titleBlock}>
            <span className={styles.mainTitle}>
              {mode === "practice" ? "Chapter Practice" : "Solutions"}
            </span>
            <span className={styles.subTitle}>{testName}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

          {!isSidebarOpen && (
            <button className={styles.settingsBtn} onClick={onToggleSidebar}>
              <FiMenu size={14} /> <span>Question Panel</span>
            </button>
          )}
        </div>
      </div>

      <div className={getTabsRowClass()}>
        {renderSubjectTab("Mathematics", TbMathFunction)}
        {renderSubjectTab("Physics", TbAtom)}
        {renderSubjectTab("Chemistry", TbFlask)}

        {isCurrentQuestionSubmitted && (
          <button 
            className={`${styles.tab} ${styles.tabSolution} ${activeTab === "solution" ? styles.active : ""}`}
            onClick={() => onTabChange("solution")}
          >
            <FileText className={styles.tabIcon} size={16} strokeWidth={2} />
            <span>Solutions</span>
          </button>
        )}

        {showTools && (
          <div className={styles.toolsContainer}>
            <button 
              onClick={onToggleTimer}
              className={`${styles.timerBlock} ${!isTimerRunning ? styles.timerPaused : ''}`}
              title={isTimerRunning ? "Pause Timer" : "Start Timer"}
            >
              <span>{timer}</span>
              {isTimerRunning ? <FiPauseCircle size={16} /> : <FiPlayCircle size={16} />}
            </button>

            <div className={styles.divider} />

            <div className={styles.marksBlock}>
              <span className={styles.posMark}>+{marksPos}</span>
              <span style={{ color: "var(--dashboard-secondary-text-color)" }}> / </span>
              <span className={styles.negMark}>-{marksNeg}</span>
            </div>
            
            {/* 🔥 UPDATED: Dynamic Bookmark Button */}
            <button 
              className={`${styles.actionBtn} ${isBookmarked ? styles.activeBookmark : ''}`}
              onClick={onBookmark}
            >
              <FiBookmark 
                size={13} 
                fill={isBookmarked ? "currentColor" : "none"} 
              /> 
              <span className={styles.btnText}>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
            
            <button className={`${styles.actionBtn} ${styles.reportBtn}`}>
              <FiAlertTriangle size={13} /> <span className={styles.btnText}>Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};