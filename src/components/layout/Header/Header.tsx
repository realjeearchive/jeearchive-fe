"use client";

import React, { useState } from "react";
import styles from "./header.module.css";
import { PiSidebar } from "react-icons/pi";
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from "react-icons/io5";
import { FiSearch, FiPlay, FiBell } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();  
  const profile = useUserStore((s) => s.profile);
  const initials = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  const [canGoBack] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.history.length > 1;
  });

  const handleBack = () => {
    if (!canGoBack) return;
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {!isSidebarOpen && (
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
          >
            <PiSidebar size={18} />
          </button>
        )}

        <div className={styles.navArrows}>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.iconButtonActive}`}
            onClick={handleBack}
          >
            <IoChevronBack size={16} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={handleForward}
          >
            <IoChevronForward size={16} />
          </button>
        </div>

        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbFolder}>Preparation</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Dashboard</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Start Mock Test */}
        <button type="button" className={styles.primaryButton}>
          <FiPlay size={14} />
          <span>Start Test</span>
        </button>

        {/* Quick Practice Mode */}
        <button type="button" className={styles.iconButton} title="Quick Practice">
          <HiOutlineLightningBolt size={16} />
        </button>

        {/* Exam Calendar */}
        <button type="button" className={styles.iconButton} title="Exam Planner">
          <IoCalendarOutline size={16} />
        </button>

        {/* Announcements & Alerts */}
        <button type="button" className={styles.iconButton} title="Notifications">
          <FiBell size={16} />
        </button>

        <div className={styles.avatar}>
          <span className={styles.avatarInitial}>{initials}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
