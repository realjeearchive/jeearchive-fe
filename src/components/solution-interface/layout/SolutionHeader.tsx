import React, { useState, useEffect } from "react";
import styles from "./SolutionHeader.module.css";
import { FiArrowLeft, FiSettings, FiMenu, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { TbMathFunction, TbAtom, TbFlask } from "react-icons/tb";
import { Subject } from "@/features/solutions/solutionsTransformer";

interface SolutionHeaderProps {
  testName: string;
  activeSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  onBack: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const SolutionHeader = ({
  testName,
  activeSubject,
  onSubjectChange,
  onBack,
  isSidebarOpen,
  onToggleSidebar,
}: SolutionHeaderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state if user exits fullscreen via Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  const getTabsRowClass = () => {
    switch (activeSubject) {
      case "Mathematics":
        return `${styles.tabsRow} ${styles.tabsRowMath}`;
      case "Physics":
        return `${styles.tabsRow} ${styles.tabsRowPhy}`;
      case "Chemistry":
        return `${styles.tabsRow} ${styles.tabsRowChem}`;
      default:
        return styles.tabsRow;
    }
  };

  return (
    <header className={styles.container} role="banner">
      <div className={styles.topRow}>
        <div className={styles.leftSection}>
          <button onClick={onBack} className={styles.backBtn} aria-label="Go back">
            <FiArrowLeft size={20} aria-hidden="true" />
          </button>
          <div className={styles.titleBlock}>
            <h1 className={styles.mainTitle}>Solutions</h1>
            <span className={styles.subTitle}>{testName}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Fullscreen Toggle */}
          <button
            className={styles.settingsBtn}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <FiMinimize2 size={14} aria-hidden="true" />
            ) : (
              <FiMaximize2 size={14} aria-hidden="true" />
            )}
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>

          <button className={styles.settingsBtn} aria-label="Settings">
            <FiSettings size={14} aria-hidden="true" /> <span>Settings</span>
          </button>

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

      <nav className={getTabsRowClass()} role="tablist" aria-label="Subject tabs">
        <button
          className={`${styles.tab} ${styles.tabMath} ${activeSubject === "Mathematics" ? styles.active : ""}`}
          onClick={() => onSubjectChange("Mathematics")}
          role="tab"
          aria-selected={activeSubject === "Mathematics"}
        >
          <TbMathFunction className={styles.tabIcon} aria-hidden="true" />
          <span>Mathematics</span>
        </button>

        <button
          className={`${styles.tab} ${styles.tabPhy} ${activeSubject === "Physics" ? styles.active : ""}`}
          onClick={() => onSubjectChange("Physics")}
          role="tab"
          aria-selected={activeSubject === "Physics"}
        >
          <TbAtom className={styles.tabIcon} aria-hidden="true" />
          <span>Physics</span>
        </button>

        <button
          className={`${styles.tab} ${styles.tabChem} ${activeSubject === "Chemistry" ? styles.active : ""}`}
          onClick={() => onSubjectChange("Chemistry")}
          role="tab"
          aria-selected={activeSubject === "Chemistry"}
        >
          <TbFlask className={styles.tabIcon} aria-hidden="true" />
          <span>Chemistry</span>
        </button>
      </nav>
    </header>
  );
};