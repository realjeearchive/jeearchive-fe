import React, { useState, useMemo } from "react";
import styles from "./SolutionSidebar.module.css";
import { FiMenu } from "react-icons/fi"; 

export interface SidebarQuestion {
  id: string; 
  number: number; // Original global number from backend (e.g., 51)
  status: "correct" | "incorrect" | "unattempted";
  section: string;
}

interface SolutionSidebarProps {
  questions: SidebarQuestion[];
  activeQuestionId: string | null;
  onQuestionClick: (id: string) => void;
  subjectName: string;
  onClose: () => void; 
}

type FilterType = "all" | "correct" | "incorrect" | "unattempted";

export const SolutionSidebar = ({ 
  questions, 
  activeQuestionId, 
  onQuestionClick, 
  subjectName,
  onClose 
}: SolutionSidebarProps) => {

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // 🚨 FIX: Calculate local numbers (1 to 25) for the active subject!
  const localNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((q, index) => {
      map.set(q.id, index + 1); // Assigns 1, 2, 3... based on the subject's array
    });
    return map;
  }, [questions]);

  // Status Counts
  const counts = {
    all: questions.length,
    correct: questions.filter(q => q.status === "correct").length,
    incorrect: questions.filter(q => q.status === "incorrect").length,
    unattempted: questions.filter(q => q.status === "unattempted").length
  };

  const filteredQuestions = questions.filter(q => {
    if (activeFilter === "all") return true;
    return q.status === activeFilter;
  });

  const sections = ["Single Correct", "Numerical", "Multiple Correct"];
  
  const renderSection = (sectionName: string) => {
    const sectionQs = filteredQuestions.filter(q => q.section === sectionName);
    if (sectionQs.length === 0) return null;

    return (
      <div key={sectionName} className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span>{subjectName} {sectionName}</span>
          <div className={styles.dottedLine} />
        </div>
        <div className={styles.grid}>
          {sectionQs.map((q) => {
            const isActive = activeQuestionId === q.id;
            let statusClass = styles.statusUnattempted;
            if (q.status === "correct") statusClass = styles.statusCorrect;
            if (q.status === "incorrect") statusClass = styles.statusIncorrect;

            return (
              <button
                key={q.id}
                className={`${styles.qBox} ${statusClass} ${isActive ? styles.isActive : ""}`}
                onClick={() => onQuestionClick(q.id)}
              >
                {/* 🚨 FIX: Render the local 1-25 number instead of the global one */}
                {localNumberMap.get(q.id)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getFilterTabsClass = () => {
    switch(activeFilter) {
      case "all": return `${styles.filterTabs} ${styles.filterTabsAll}`;
      case "correct": return `${styles.filterTabs} ${styles.filterTabsCorrect}`;
      case "incorrect": return `${styles.filterTabs} ${styles.filterTabsIncorrect}`;
      case "unattempted": return `${styles.filterTabs} ${styles.filterTabsUnattempted}`;
      default: return styles.filterTabs;
    }
  };

  return (
    <aside className={styles.sidebar}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.subjectTitle}>All {subjectName} Questions</span>
        <button className={styles.hideBtn} onClick={onClose}>
          HIDE <FiMenu />
        </button>
      </div>

      {/* FILTER TABS */}
      <div className={getFilterTabsClass()}>
        <button 
          className={`${styles.tab} ${styles.tabAll} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <span className={styles.tabLabel}>All</span>
          <span className={styles.tabCount}>{counts.all}</span>
        </button>

        <button 
          className={`${styles.tab} ${styles.tabCorrect} ${activeFilter === 'correct' ? styles.active : ''}`}
          onClick={() => setActiveFilter('correct')}
        >
          <span className={styles.tabLabel}>Correct</span>
          <span className={styles.tabCount}>{counts.correct}</span>
        </button>

        <button 
          className={`${styles.tab} ${styles.tabIncorrect} ${activeFilter === 'incorrect' ? styles.active : ''}`}
          onClick={() => setActiveFilter('incorrect')}
        >
          <span className={styles.tabLabel}>Incorrect</span>
          <span className={styles.tabCount}>{counts.incorrect}</span>
        </button>

        <button 
          className={`${styles.tab} ${styles.tabUnattempted} ${activeFilter === 'unattempted' ? styles.active : ''}`}
          onClick={() => setActiveFilter('unattempted')}
        >
          <span className={styles.tabLabel}>Unattempted</span>
          <span className={styles.tabCount}>{counts.unattempted}</span>
        </button>
      </div>

      <div className={styles.content}>
        {sections.map(sec => renderSection(sec))}
        {filteredQuestions.length === 0 && (
          <div className="text-center text-xs text-gray-500 mt-10">
            No questions found in this category.
          </div>
        )}
      </div>

    </aside>
  );
};