"use client";

import React, { useState } from "react";
import styles from "./SolutionSidebar.module.css";
import { FiMenu } from "react-icons/fi";

export interface QuestionStatus {
  id: string;
  number: number;
  status: "correct" | "unattempted"; // 🔥 FIX: Removed 'incorrect'
  section: "Single Correct" | "Numerical" | "Multiple Correct";
}

interface SolutionSidebarProps {
  questions: QuestionStatus[];
  activeQuestionId: string;
  onQuestionClick: (id: string) => void;
  subjectName: string;
  onClose: () => void;
  mode?: "solution" | "practice";
}

type FilterType = "all" | "correct" | "unattempted"; // 🔥 FIX: Removed 'incorrect'

export const SolutionSidebar = ({
  questions,
  activeQuestionId,
  onQuestionClick,
  subjectName,
  onClose,
  mode = "solution",
}: SolutionSidebarProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const counts = {
    all: questions.length,
    correct: questions.filter((q) => q.status === "correct").length,
    unattempted: questions.filter((q) => q.status === "unattempted").length,
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === "all") return true;
    return q.status === activeFilter;
  });

  const sections = Array.from(new Set(questions.map((q) => q.section)));

  const renderSection = (sectionName: string) => {
    const sectionQs = [...filteredQuestions]
      .filter((q) => q.section === sectionName)
      .sort((a, b) => a.number - b.number);

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

            return (
              <button
                key={q.id}
                className={`${styles.qBox} ${statusClass} ${isActive ? styles.isActive : ""}`}
                onClick={() => onQuestionClick(q.id)}
                aria-label={`Question ${q.number}: ${q.status}`}
                aria-current={isActive ? "true" : undefined}
              >
                {q.number}
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
          {mode === "practice" ? "Question Palette" : `All ${subjectName} Questions`}
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

        {/* 🔥 FIX: Incorrect Button removed completely */}

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
            No questions found.
          </div>
        )}
      </div>
    </aside>
  );
};