"use client";

import React from "react";
import styles from "./header.module.css";
import { PiSidebar } from "react-icons/pi";
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from "react-icons/io5";
import { FiSearch, FiPlus, FiBell } from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className={styles.header}>
      {/* LEFT: sidebar toggle + navigation arrows + breadcrumb */}
      <div className={styles.leftSection}>
        {/* Sidebar toggle (only when sidebar is hidden) */}
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
          <button type="button" className={styles.iconButton}>
            <IoChevronBack size={16} />
          </button>
          <button type="button" className={styles.iconButton}>
            <IoChevronForward size={16} />
          </button>
        </div>

        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbFolder}>Tasks</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>All Tasks</span>
        </div>
      </div>

      {/* RIGHT: actions, search, view, calendar, bell, avatar */}
      <div className={styles.rightSection}>
        <button type="button" className={styles.primaryButton}>
          <FiPlus size={14} />
          <span>New</span>
        </button>

        <button type="button" className={styles.iconButton}>
          <FiSearch size={16} />
        </button>

        <button type="button" className={styles.iconButton}>
          <HiOutlineViewGrid size={16} />
        </button>

        <button type="button" className={styles.iconButton}>
          <IoCalendarOutline size={16} />
        </button>

        <button type="button" className={styles.iconButton}>
          <FiBell size={16} />
        </button>

        <div className={styles.avatar}>
          <span className={styles.avatarInitial}>A</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
