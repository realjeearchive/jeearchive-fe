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
    <nav className={styles.headerContainer} aria-label="Dashboard filters">
      {/* Exam filter dropdown */}
      <div className={styles.dropdownWrapper} ref={examRef}>
        <button
          className={`${styles.triggerButton} ${examOpen ? styles.active : ""}`}
          onClick={() => setExamOpen(!examOpen)}
          aria-expanded={examOpen}
          aria-haspopup="listbox"
          aria-label={`Exam filter: ${EXAM_LABELS[examFilter]}`}
        >
          <span className={styles.triggerText}>{EXAM_LABELS[examFilter]}</span>
          <FiChevronDown
            className={`${styles.chevron} ${examOpen ? styles.rotate : ""}`}
            aria-hidden="true"
          />
        </button>

        {examOpen && (
          <div className={styles.dropdownMenu} role="listbox" aria-label="Select exam filter">
            {examOptions.map((option) => (
              <div
                key={option}
                className={`${styles.menuItem} ${examFilter === option ? styles.selected : ""}`}
                role="option"
                aria-selected={examFilter === option}
                onClick={() => {
                  onExamFilterChange(option);
                  setExamOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onExamFilterChange(option);
                    setExamOpen(false);
                  }
                }}
                tabIndex={0}
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
          aria-expanded={viewOpen}
          aria-haspopup="listbox"
          aria-label={`View mode: ${VIEW_LABELS[currentView]}`}
        >
          <span className={styles.triggerText}>{VIEW_LABELS[currentView]}</span>
          <FiChevronDown
            className={`${styles.chevron} ${viewOpen ? styles.rotate : ""}`}
            aria-hidden="true"
          />
        </button>

        {viewOpen && (
          <div className={styles.dropdownMenu} role="listbox" aria-label="Select view mode">
            {viewOptions.map((option) => (
              <div
                key={option}
                className={`${styles.menuItem} ${currentView === option ? styles.selected : ""}`}
                role="option"
                aria-selected={currentView === option}
                onClick={() => {
                  onViewChange(option);
                  setViewOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onViewChange(option);
                    setViewOpen(false);
                  }
                }}
                tabIndex={0}
              >
                {VIEW_LABELS[option]}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardHeader;