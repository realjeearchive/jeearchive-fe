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
  onExamChange
}) => {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const examRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) setIsTimeOpen(false);
      if (examRef.current && !examRef.current.contains(event.target as Node)) setIsExamOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.header}>
      
      <div className={styles.filters}>
        {/* Exam Type Dropdown */}
        <div className={styles.dropdownWrapper} ref={examRef}>
          <button 
            className={`${styles.trigger} ${isExamOpen ? styles.active : ""}`}
            onClick={() => { setIsExamOpen(!isExamOpen); setIsTimeOpen(false); }}
          >
            <FiFilter className={styles.icon} />
            <span>{selectedExam}</span>
            <FiChevronDown className={`${styles.chevron} ${isExamOpen ? styles.rotate : ""}`} />
          </button>

          {isExamOpen && (
            <div className={styles.menu}>
              {(["Overall", "JEE Main", "JEE Advanced"] as ExamTypeUI[]).map((option) => (
                <div
                  key={option}
                  className={`${styles.menuItem} ${selectedExam === option ? styles.selected : ""}`}
                  onClick={() => { onExamChange(option); setIsExamOpen(false); }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Dropdown */}
        <div className={styles.dropdownWrapper} ref={timeRef}>
          <button 
            className={`${styles.trigger} ${isTimeOpen ? styles.active : ""}`}
            onClick={() => { setIsTimeOpen(!isTimeOpen); setIsExamOpen(false); }}
          >
            <FiCalendar className={styles.icon} />
            <span>{selectedRange}</span>
            <FiChevronDown className={`${styles.chevron} ${isTimeOpen ? styles.rotate : ""}`} />
          </button>

          {isTimeOpen && (
            <div className={styles.menu}>
              {(["Last 3 Tests", "Last 5 Tests", "All Tests"] as TimeRange[]).map((option) => (
                <div
                  key={option}
                  className={`${styles.menuItem} ${selectedRange === option ? styles.selected : ""}`}
                  onClick={() => { onRangeChange(option); setIsTimeOpen(false); }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;