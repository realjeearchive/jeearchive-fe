"use client";

import React from "react";
import styles from "./SolutionHeader.module.css";
import { FiArrowLeft, FiSettings, FiMenu } from "react-icons/fi";
import { TbMathFunction, TbAtom, TbFlask } from "react-icons/tb"; 

interface SolutionHeaderProps {
  testName: string;
  activeSubject: "Physics" | "Chemistry" | "Mathematics";
  onSubjectChange?: (subject: "Physics" | "Chemistry" | "Mathematics") => void;
  onBack: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  mode?: "solution" | "practice";
}

export const SolutionHeader = ({ 
  testName, 
  activeSubject, 
  onSubjectChange, 
  onBack,
  isSidebarOpen,
  onToggleSidebar,
  mode = "solution"
}: SolutionHeaderProps) => {

  const getTabsRowClass = () => {
    switch(activeSubject) {
      case "Mathematics": return `${styles.tabsRow} ${styles.tabsRowMath}`;
      case "Physics": return `${styles.tabsRow} ${styles.tabsRowPhy}`;
      case "Chemistry": return `${styles.tabsRow} ${styles.tabsRowChem}`;
      default: return styles.tabsRow;
    }
  };

  // FIX: Changed 'Icon: any' to 'Icon: React.ElementType'
  const renderTab = (subject: "Physics" | "Chemistry" | "Mathematics", Icon: React.ElementType) => {
    const isActive = activeSubject === subject;
    
    // In practice mode, only show the active subject
    if (mode === "practice" && !isActive) return null;

    return (
      <button 
        key={subject}
        className={`${styles.tab} ${subject === "Mathematics" ? styles.tabMath : subject === "Physics" ? styles.tabPhy : styles.tabChem} ${isActive ? styles.active : ""}`}
        onClick={() => onSubjectChange && onSubjectChange(subject)}
        style={{ cursor: mode === "practice" ? "default" : "pointer" }}
      >
        <Icon className={styles.tabIcon} />
        <span>{subject}</span>
      </button>
    );
  };

  return (
    <div className={styles.container}>
      
      {/* --- ROW 1: Title & Settings --- */}
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
          <button className={styles.settingsBtn}>
            <FiSettings size={14} /> <span>Settings</span>
          </button>

          {!isSidebarOpen && (
            <button className={styles.settingsBtn} onClick={onToggleSidebar}>
              <FiMenu size={14} /> <span>Question Panel</span>
            </button>
          )}
        </div>
      </div>

      {/* --- ROW 2: Subject Tabs --- */}
      <div className={getTabsRowClass()}>
        {renderTab("Mathematics", TbMathFunction)}
        {renderTab("Physics", TbAtom)}
        {renderTab("Chemistry", TbFlask)}
      </div>

    </div>
  );
};