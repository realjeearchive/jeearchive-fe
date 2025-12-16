"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import styles from "./layout.module.css";
import Header from "@/components/layout/Header/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  // MOBILE OVERLAY - Click to close
  const handleOverlayClick = () => {
    if (window.innerWidth <= 900) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.appWrap}>
      {/* MOBILE OVERLAY - covers screen when sidebar open */}
      {isSidebarOpen && window.innerWidth <= 900 && (
        <div 
          className={styles.mobileOverlay}
          onClick={handleOverlayClick}
        />
      )}

      {/* SIDEBAR WRAPPER */}
      <div
        className={`${styles.sidebarContainer} ${
          !isSidebarOpen ? styles.hideSidebar : ""
        }`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* MAIN CONTENT */}
      <main className={styles.dashboard}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={styles.dashboardRight}>{children}</div>
      </main>
    </div>
  );
}
