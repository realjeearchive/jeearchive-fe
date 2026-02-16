"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar/Sidebar"; // Update path if needed
import Header from "@/components/layout/Header/Header";   // Update path if needed
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // 1. Hooks must be at the top
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const initialized = useAuthStore((s) => s.initialized);
  const accessToken = useAuthStore((s) => s.accessToken);
  const authed = !!accessToken;

  // 2. Initial Resize Logic
  useEffect(() => {
    const handleInitialResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 900) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    };
    handleInitialResize();
  }, []);

  // --- FULL SCREEN DETECTION LOGIC ---
  // We check if the URL matches the deep structure of the test interface:
  // Pattern: /chapter-wise-questions/[subject]/[division]/[chapter]
  // This usually results in 5 parts when split by '/' (e.g., "", "chapter-wise...", "phy", "mech", "kinematics")
  const isChapterTestPage = 
    pathname?.includes("/chapter-wise-questions/") && 
    pathname.split("/").length >= 5;

  // 3. Early Returns (Loading / Auth / Full Screen)

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your dashboard...
      </div>
    );
  }

  // If unauthenticated, return null (or redirect logic if you have it elsewhere)
  if (!authed) {
    return null;
  }

  // >> THE FIX: If it is the test page, return ONLY children (Full Screen) <<
  if (isChapterTestPage) {
    return <>{children}</>;
  }

  // 4. Standard Dashboard UI
  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleOverlayClick = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
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
        {/* Pass props if your Sidebar needs them */}
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      <main className={styles.dashboard}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={styles.dashboardRight}>{children}</div>
      </main>
    </div>
  );
}