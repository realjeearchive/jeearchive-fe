"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCalendar, FiFilter } from "react-icons/fi";
import styles from "./AnalyticsHeader.module.css";

export type TimeRange = "Last 3 Tests" | "Last 5 Tests" | "All Tests";
export type ExamTypeUI = "Overall" | "JEE Main" | "JEE Advanced";

interface AnalyticsHeaderProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  selectedExam: ExamTypeUI;
  onExamChange: (exam: ExamTypeUI) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedRange,
  onRangeChange,
  selectedExam,
  onExamChange,
}) => {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const examRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(event.target as Node))
        setIsTimeOpen(false);
      if (examRef.current && !examRef.current.contains(event.target as Node))
        setIsExamOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.header} aria-label="Analytics filters">
      <div className={styles.filters}>
        {/* Exam Type Dropdown */}
        <div
          className={`${styles.dropdownWrapper} ${isExamOpen ? styles.dropdownActive : ""}`}
          ref={examRef}
        >
          <button
            className={`${styles.trigger} ${isExamOpen ? styles.active : ""}`}
            onClick={() => {
              setIsExamOpen(!isExamOpen);
              setIsTimeOpen(false);
            }}
            aria-expanded={isExamOpen}
            aria-haspopup="listbox"
            aria-label={`Exam filter: ${selectedExam}`}
          >
            <span>{selectedExam}</span>
            <FiChevronDown
              className={`${styles.chevron} ${isExamOpen ? styles.rotate : ""}`}
              aria-hidden="true"
            />
          </button>

          {isExamOpen && (
            <div className={styles.menu} role="listbox" aria-label="Select exam type">
              {(["Overall", "JEE Main", "JEE Advanced"] as ExamTypeUI[]).map(
                (option) => (
                  <div
                    key={option}
                    className={`${styles.menuItem} ${selectedExam === option ? styles.selected : ""}`}
                    role="option"
                    aria-selected={selectedExam === option}
                    onClick={() => {
                      onExamChange(option);
                      setIsExamOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onExamChange(option);
                        setIsExamOpen(false);
                      }
                    }}
                    tabIndex={0}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Time Range Dropdown */}
        <div
          className={`${styles.dropdownWrapper} ${isTimeOpen ? styles.dropdownActive : ""}`}
          ref={timeRef}
        >
          <button
            className={`${styles.trigger} ${isTimeOpen ? styles.active : ""}`}
            onClick={() => {
              setIsTimeOpen(!isTimeOpen);
              setIsExamOpen(false);
            }}
            aria-expanded={isTimeOpen}
            aria-haspopup="listbox"
            aria-label={`Time range: ${selectedRange}`}
          >
            <span>{selectedRange}</span>
            <FiChevronDown
              className={`${styles.chevron} ${isTimeOpen ? styles.rotate : ""}`}
              aria-hidden="true"
            />
          </button>

          {isTimeOpen && (
            <div className={styles.menu} role="listbox" aria-label="Select time range">
              {(["Last 3 Tests", "Last 5 Tests", "All Tests"] as TimeRange[]).map(
                (option) => (
                  <div
                    key={option}
                    className={`${styles.menuItem} ${selectedRange === option ? styles.selected : ""}`}
                    role="option"
                    aria-selected={selectedRange === option}
                    onClick={() => {
                      onRangeChange(option);
                      setIsTimeOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRangeChange(option);
                        setIsTimeOpen(false);
                      }
                    }}
                    tabIndex={0}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AnalyticsHeader;