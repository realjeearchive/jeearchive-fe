"use client";

import React, { useState } from "react";
import styles from "./header.module.css";
import { PiSidebar } from "react-icons/pi";
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from "react-icons/io5";
import { FiSearch, FiPlus, FiBell } from "react-icons/fi";
import { HiOutlineViewGrid } from "react-icons/hi";
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
          <span className={styles.breadcrumbFolder}>Tasks</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>All Tasks</span>
        </div>
      </div>

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
          <span className={styles.avatarInitial}>{initials}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
