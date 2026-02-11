import React from "react";
import styles from "./SolutionHeader.module.css";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { TbMathFunction, TbAtom, TbFlask } from "react-icons/tb"; 

interface SolutionHeaderProps {
  testName: string;
  activeSubject: "Physics" | "Chemistry" | "Mathematics";
  onSubjectChange: (subject: "Physics" | "Chemistry" | "Mathematics") => void;
  onBack: () => void;
}

export const SolutionHeader = ({ 
  testName, 
  activeSubject, 
  onSubjectChange, 
  onBack 
}: SolutionHeaderProps) => {

  // Determine the row class based on active subject
  const getTabsRowClass = () => {
    switch(activeSubject) {
      case "Mathematics": return `${styles.tabsRow} ${styles.tabsRowMath}`;
      case "Physics": return `${styles.tabsRow} ${styles.tabsRowPhy}`;
      case "Chemistry": return `${styles.tabsRow} ${styles.tabsRowChem}`;
      default: return styles.tabsRow;
    }
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
            <span className={styles.mainTitle}>Solutions</span>
            <span className={styles.subTitle}>{testName}</span>
          </div>
        </div>

        <button className={styles.settingsBtn}>
          <FiSettings size={14} /> Settings
        </button>
      </div>

      {/* --- ROW 2: Subject Tabs --- */}
      <div className={getTabsRowClass()}>
        
        {/* MATHEMATICS */}
        <button 
          className={`
            ${styles.tab} ${styles.tabMath} 
            ${activeSubject === "Mathematics" ? styles.active : ""}
          `}
          onClick={() => onSubjectChange("Mathematics")}
        >
          <TbMathFunction className={styles.tabIcon} />
          <span>Mathematics</span>
        </button>

        {/* PHYSICS */}
        <button 
          className={`
            ${styles.tab} ${styles.tabPhy} 
            ${activeSubject === "Physics" ? styles.active : ""}
          `}
          onClick={() => onSubjectChange("Physics")}
        >
          <TbAtom className={styles.tabIcon} />
          <span>Physics</span>
        </button>

        {/* CHEMISTRY */}
        <button 
          className={`
            ${styles.tab} ${styles.tabChem} 
            ${activeSubject === "Chemistry" ? styles.active : ""}
          `}
          onClick={() => onSubjectChange("Chemistry")}
        >
          <TbFlask className={styles.tabIcon} />
          <span>Chemistry</span>
        </button>

      </div>

    </div>
  );
};