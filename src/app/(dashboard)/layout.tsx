"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import styles from "./layout.module.css";
import { PiSidebar } from "react-icons/pi";

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
        
        {/* ICON INSIDE MAIN (only when sidebar is hidden) */}
        {!isSidebarOpen && (
          <button className={styles.sidebarOpenButton} onClick={toggleSidebar}>
            <PiSidebar size={22} />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
