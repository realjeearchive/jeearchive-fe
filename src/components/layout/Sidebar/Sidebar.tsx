"use client";

import React, { FC } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";

import { PiSidebar } from "react-icons/pi";
import {
  FiHome,
  FiBookOpen,
  FiLayers,
  FiBarChart2,
  FiAward,
  FiUsers,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

export interface SidebarProps {
  toggleSidebar: () => void;
  activeRoute?: string;
}

const Sidebar: FC<SidebarProps> = ({ toggleSidebar, activeRoute }) => {
  const currentRoute = activeRoute ?? "dashboard";

  const mainLinks = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome size={16} /> },
    { id: "pyq", label: "Previous Year Questions", icon: <FiBookOpen size={16} /> },
    { id: "chapter", label: "Chapter wise Questions", icon: <FiLayers size={16} /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 size={16} /> },
    { id: "leaderboard", label: "Leaderboards", icon: <FiAward size={16} /> },
    { id: "friends", label: "Play with Friends", icon: <FiUsers size={16} /> },
  ];

  const secondaryLinks = [
    { id: "profile", label: "Profile", icon: <FiUser size={16} /> },
    { id: "settings", label: "Settings", icon: <FiSettings size={16} /> },
    { id: "help", label: "Help & Support", icon: <FiHelpCircle size={16} /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <button
        onClick={toggleSidebar}
        className={styles.sidebarIcon}
        aria-label="Toggle Sidebar"
      >
        <PiSidebar size={18} />
      </button>

      <div className={styles.sidebarInner}>
        {/* Brand */}
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.png"
            alt="JEEArchive Logo"
            width={32}
            height={32}
            className={styles.logo}
          />
          <div className={styles.logoTextBlock}>
            <span className={styles.logoText}>JEEArchive</span>
            <span className={styles.logoSubText}>Ace your JEE</span>
          </div>
        </div>

        {/* Nav sections */}
        <nav className={styles.nav}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Practice</span>
              <span className={styles.sectionDivider} />
            </div>
            <ul>
              {mainLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${styles.navItem} ${
                    currentRoute === link.id ? styles.navItemActive : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Account</span>
              <span className={styles.sectionDivider} />
            </div>
            <ul>
              {secondaryLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${styles.navItem} ${
                    currentRoute === link.id ? styles.navItemActive : ""
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerProfile}>
          <div className={styles.footerAvatar}>
            <span>AS</span>
          </div>
          <div className={styles.footerInfo}>
            <span className={styles.footerName}>Ayush Singh</span>
            <span className={styles.footerTag}>JEE Mentor</span>
          </div>
        </div>
        <button className={styles.footerAction} aria-label="Logout">
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
