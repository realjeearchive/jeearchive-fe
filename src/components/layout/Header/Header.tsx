"use client";

import React, { useState } from "react";
import styles from "./header.module.css";
import { PiSidebar, PiDiscordLogo } from "react-icons/pi"; // Added PiDiscordLogo
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoTimeOutline } from "react-icons/io5"; // Added IoTimeOutline
import { FiBell } from "react-icons/fi"; // Removed FiSearch, FiPlay
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();  
  const profile = useUserStore((s) => s.profile);

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

  {/* Discord Link */}
  <a 
    href="https://discord.com/invite/8Q9Nb2fATj" 
    target="_blank" 
    rel="noopener noreferrer" 
    className={styles.iconButton} 
    data-title="Join Discord" 
  >
    <PiDiscordLogo size={18} />
  </a>

  {/* Clock */}
  <button 
    type="button" 
    className={styles.iconButton} 
    data-title="Timer App"
  >
    <IoTimeOutline size={18} />
  </button>

  {/* Exam Calendar */}
  <button 
    type="button" 
    className={styles.iconButton} 
    data-title="Calendar App"
  >
    <IoCalendarOutline size={16} />
  </button>

  {/* Announcements */}
  <button 
    type="button" 
    className={styles.iconButton} 
    data-title="Notifications"
  >
    <FiBell size={16} />
  </button>

</div>
    </header>
  );
};

export default Header;