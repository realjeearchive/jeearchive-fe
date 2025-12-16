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

  return (
    <div className={styles.appWrap}>
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

        {/* NEW HEADER */}
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* PAGE CONTENT */}
        <div className={styles.dashboardRight}>{children}</div>
      </main>
    </div>
  );
}
