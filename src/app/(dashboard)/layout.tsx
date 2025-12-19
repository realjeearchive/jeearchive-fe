"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import styles from "./layout.module.css";
import Header from "@/components/layout/Header/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const initialized = useAuthStore((s) => s.initialized);
  const accessToken = useAuthStore((s) => s.accessToken);
  const authed = !!accessToken;

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your dashboard...
      </div>
    );
  }
  if (!authed) {
    return null;
  }

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleOverlayClick = () => {
    if (window.innerWidth <= 900) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={styles.appWrap}>
      {isSidebarOpen && typeof window !== "undefined" && window.innerWidth <= 900 && (
        <div
          className={styles.mobileOverlay}
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`${styles.sidebarContainer} ${
          !isSidebarOpen ? styles.hideSidebar : ""
        }`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      <main className={styles.dashboard}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={styles.dashboardRight}>{children}</div>
      </main>
    </div>
  );
}
