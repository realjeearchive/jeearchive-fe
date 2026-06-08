import React, { useState, useMemo } from "react";
import styles from "./SolutionSidebar.module.css";
import { FiMenu } from "react-icons/fi";

export interface SidebarQuestion {
  id: string;
  number: number;
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
  onClose,
}: SolutionSidebarProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const localNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((q, index) => {
      map.set(q.id, index + 1);
    });
    return map;
  }, [questions]);

  const counts = {
    all: questions.length,
    correct: questions.filter((q) => q.status === "correct").length,
    incorrect: questions.filter((q) => q.status === "incorrect").length,
    unattempted: questions.filter((q) => q.status === "unattempted").length,
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === "all") return true;
    return q.status === activeFilter;
  });

  const sections = ["Single Correct", "Numerical", "Multiple Correct"];

  const renderSection = (sectionName: string) => {
    const sectionQs = filteredQuestions.filter(
      (q) => q.section === sectionName
    );
    if (sectionQs.length === 0) return null;

    return (
      <div key={sectionName} className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <span>
            {subjectName} {sectionName}
          </span>
          <div className={styles.dottedLine} aria-hidden="true" />
        </div>
        <div className={styles.grid} role="list" aria-label={`${sectionName} questions`}>
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
                aria-label={`Question ${localNumberMap.get(q.id)}: ${q.status}`}
                aria-current={isActive ? "true" : undefined}
              >
                {localNumberMap.get(q.id)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getFilterTabsClass = () => {
    switch (activeFilter) {
      case "all":
        return `${styles.filterTabs} ${styles.filterTabsAll}`;
      case "correct":
        return `${styles.filterTabs} ${styles.filterTabsCorrect}`;
      case "incorrect":
        return `${styles.filterTabs} ${styles.filterTabsIncorrect}`;
      case "unattempted":
        return `${styles.filterTabs} ${styles.filterTabsUnattempted}`;
      default:
        return styles.filterTabs;
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Question navigation sidebar">
      <div className={styles.header}>
        <span className={styles.subjectTitle}>
          All {subjectName} Questions
        </span>
        <button className={styles.hideBtn} onClick={onClose} aria-label="Hide sidebar">
          HIDE <FiMenu aria-hidden="true" />
        </button>
      </div>

      <nav className={getFilterTabsClass()} aria-label="Filter questions by status">
        <button
          className={`${styles.tab} ${styles.tabAll} ${activeFilter === "all" ? styles.active : ""}`}
          onClick={() => setActiveFilter("all")}
          aria-pressed={activeFilter === "all"}
        >
          <span className={styles.tabLabel}>All</span>
          <span className={styles.tabCount}>{counts.all}</span>
        </button>

        <button
          className={`${styles.tab} ${styles.tabCorrect} ${activeFilter === "correct" ? styles.active : ""}`}
          onClick={() => setActiveFilter("correct")}
          aria-pressed={activeFilter === "correct"}
        >
          <span className={styles.tabLabel}>Correct</span>
          <span className={styles.tabCount}>{counts.correct}</span>
        </button>

        <button
          className={`${styles.tab} ${styles.tabIncorrect} ${activeFilter === "incorrect" ? styles.active : ""}`}
          onClick={() => setActiveFilter("incorrect")}
          aria-pressed={activeFilter === "incorrect"}
        >
          <span className={styles.tabLabel}>Incorrect</span>
          <span className={styles.tabCount}>{counts.incorrect}</span>
        </button>

        <button
          className={`${styles.tab} ${styles.tabUnattempted} ${activeFilter === "unattempted" ? styles.active : ""}`}
          onClick={() => setActiveFilter("unattempted")}
          aria-pressed={activeFilter === "unattempted"}
        >
          <span className={styles.tabLabel}>Unattempted</span>
          <span className={styles.tabCount}>{counts.unattempted}</span>
        </button>
      </nav>

      <div className={styles.content}>
        {sections.map((sec) => renderSection(sec))}
        {filteredQuestions.length === 0 && (
          <div className="text-center text-xs text-gray-500 mt-10" role="status">
            No questions found in this category.
          </div>
        )}
      </div>
    </aside>
  );
};