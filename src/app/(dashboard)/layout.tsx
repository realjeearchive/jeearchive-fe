"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar/Sidebar"; 
import Header from "@/components/layout/Header/Header";   
import AnnouncementBar from "@/components/layout/AnnouncementBar/AnnouncementBar"; // 🔥 Imported Announcement Bar
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // 1. Hooks must be at the top
  const pathname = usePathname();
  const [isSidebarToggled, setIsSidebarToggled] = useState<boolean>(false);
  const initialized = useAuthStore((s) => s.initialized);
  const accessToken = useAuthStore((s) => s.accessToken);
  const authed = !!accessToken;

  // --- FULL SCREEN DETECTION LOGIC ---
  const isChapterTestPage = 
    pathname?.includes("/chapter-wise-questions/") && 
    pathname.split("/").length >= 6;

  // 3. Early Returns (Loading / Auth / Full Screen)
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

  // >> If it is the test page, return ONLY children (Full Screen, No Header, No Sidebar, No Announcement) <<
  if (isChapterTestPage) {
    return <>{children}</>;
  }

  // 4. Standard Dashboard UI
  const toggleSidebar = (): void => {
    setIsSidebarToggled((prev) => !prev);
  };

  const handleOverlayClick = () => {
    // Only used on mobile to close the sidebar. 
    // On mobile, isSidebarToggled = true means OPEN. 
    // So setting to false closes it.
    setIsSidebarToggled(false);
  };

  return (
    // 🔥 NEW: rootWrapper ensures vertical stacking of the announcement bar and the app layout
    <div className={styles.rootWrapper}>
      
      {/* 🔥 The Announcement Bar */}
      <AnnouncementBar />

      <div className={styles.appWrap}>
        {isSidebarToggled && (
          <div
            className={styles.mobileOverlay}
            onClick={handleOverlayClick}
          />
        )}

        <div
          className={`${styles.sidebarContainer} ${
            isSidebarToggled ? styles.toggled : ""
          }`}
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        <main className={styles.dashboard}>
          <Header isSidebarToggled={isSidebarToggled} toggleSidebar={toggleSidebar} />
          <div className={styles.dashboardRight}>{children}</div>
        </main>
      </div>
    </div>
  );
}