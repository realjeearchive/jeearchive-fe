"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCalendar } from "react-icons/fi";
import styles from "./AnalyticsHeader.module.css";

export type TimeRange = "Last 3 Tests" | "Last 5 Tests" | "All Tests";

interface AnalyticsHeaderProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (range: TimeRange) => {
    onRangeChange(range);
    setIsOpen(false);
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Overall Performance</h1>

      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button 
          className={`${styles.trigger} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiCalendar className={styles.icon} />
          <span>{selectedRange}</span>
          <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
        </button>

        {isOpen && (
          <div className={styles.menu}>
            {["Last 3 Tests", "Last 5 Tests", "All Tests"].map((option) => (
              <div
                key={option}
                className={`${styles.menuItem} ${selectedRange === option ? styles.selected : ""}`}
                onClick={() => handleSelect(option as TimeRange)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsHeader;