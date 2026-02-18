"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  currentView: "test" | "chapter";
  onViewChange: (view: "test" | "chapter") => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentView,
  onViewChange,
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

  const handleSelect = (view: "test" | "chapter") => {
    onViewChange(view);
    setIsOpen(false);
  };

  const getLabel = () => {
    return currentView === "test" ? "Full Mock Tests" : "Chapter-wise Practice";
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button 
          className={`${styles.triggerButton} ${isOpen ? styles.active : ""}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.triggerText}>{getLabel()}</span>
          <FiChevronDown className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div 
              className={`${styles.menuItem} ${currentView === "test" ? styles.selected : ""}`}
              onClick={() => handleSelect("test")}
            >
              Full Mock Tests
            </div>

            <div 
              className={`${styles.menuItem} ${currentView === "chapter" ? styles.selected : ""}`}
              onClick={() => handleSelect("chapter")}
            >
              Chapter-wise Practice
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;