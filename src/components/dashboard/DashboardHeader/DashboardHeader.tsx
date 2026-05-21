"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./DashboardHeader.module.css";

export type ExamFilter = "overall" | "jeeMain" | "jeeAdvanced";
export type ViewMode = "test" | "chapter";

const EXAM_LABELS: Record<ExamFilter, string> = {
  overall: "Overall",
  jeeMain: "JEE Main",
  jeeAdvanced: "JEE Advanced",
};

const VIEW_LABELS: Record<ViewMode, string> = {
  test: "Full Mock Tests",
  chapter: "Chapter-wise Practice",
};

interface DashboardHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  examFilter: ExamFilter;
  onExamFilterChange: (filter: ExamFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentView,
  onViewChange,
  examFilter,
  onExamFilterChange,
}) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const examRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewRef.current && !viewRef.current.contains(event.target as Node)) {
        setViewOpen(false);
      }
      if (examRef.current && !examRef.current.contains(event.target as Node)) {
        setExamOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const examOptions: ExamFilter[] = ["overall", "jeeMain", "jeeAdvanced"];
  const viewOptions: ViewMode[] = ["test", "chapter"];

  return (
    <div className={styles.headerContainer}>
      {/* Exam filter dropdown */}
      <div className={styles.dropdownWrapper} ref={examRef}>
        <button
          className={`${styles.triggerButton} ${examOpen ? styles.active : ""}`}
          onClick={() => setExamOpen(!examOpen)}
        >
          <span className={styles.triggerText}>{EXAM_LABELS[examFilter]}</span>
          <FiChevronDown className={`${styles.chevron} ${examOpen ? styles.rotate : ""}`} />
        </button>

        {examOpen && (
          <div className={styles.dropdownMenu}>
            {examOptions.map((option) => (
              <div
                key={option}
                className={`${styles.menuItem} ${examFilter === option ? styles.selected : ""}`}
                onClick={() => {
                  onExamFilterChange(option);
                  setExamOpen(false);
                }}
              >
                {EXAM_LABELS[option]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View mode dropdown */}
      <div className={styles.dropdownWrapper} ref={viewRef}>
        <button
          className={`${styles.triggerButton} ${viewOpen ? styles.active : ""}`}
          onClick={() => setViewOpen(!viewOpen)}
        >
          <span className={styles.triggerText}>{VIEW_LABELS[currentView]}</span>
          <FiChevronDown className={`${styles.chevron} ${viewOpen ? styles.rotate : ""}`} />
        </button>

        {viewOpen && (
          <div className={styles.dropdownMenu}>
            {viewOptions.map((option) => (
              <div
                key={option}
                className={`${styles.menuItem} ${currentView === option ? styles.selected : ""}`}
                onClick={() => {
                  onViewChange(option);
                  setViewOpen(false);
                }}
              >
                {VIEW_LABELS[option]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;