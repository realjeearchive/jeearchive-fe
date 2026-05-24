"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import styles from "./header.module.css";
import { PiSidebar, PiDiscordLogo } from "react-icons/pi";
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Navigation history manager using module-level variables
let navigationStack: string[] = [];
let currentStackIndex: number = -1;

// Initialize from sessionStorage
if (typeof window !== "undefined") {
  try {
    const stored = sessionStorage.getItem("navState");
    if (stored) {
      const { stack, index } = JSON.parse(stored);
      navigationStack = stack || [];
      currentStackIndex = index ?? -1;
    }
  } catch {
    navigationStack = [];
    currentStackIndex = -1;
  }
}

// Helper functions
const formatSegment = (segment: string): string => {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getPageTitle = (path: string): string | null => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  
  const meaningfulSegments = segments.filter(segment => !UUID_PATTERN.test(segment));
  if (meaningfulSegments.length === 0) return null;
  
  return formatSegment(meaningfulSegments[meaningfulSegments.length - 1]);
};

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useUserStore((s) => s.profile);
  
  // This is the ONLY state we need - a simple counter to trigger re-renders
  const [renderTick, setRenderTick] = useState(0);
  const previousPathnameRef = useRef(pathname);

  // Update navigation stack when pathname changes - happens DURING rendering, not in effect
  if (pathname !== previousPathnameRef.current) {
    const existingIndex = navigationStack.indexOf(pathname);
    
    if (existingIndex !== -1) {
      // Navigating to existing path in history
      currentStackIndex = existingIndex;
    } else {
      // New path - add to stack, clear forward history
      navigationStack = [...navigationStack.slice(0, currentStackIndex + 1), pathname];
      currentStackIndex = navigationStack.length - 1;
    }
    
    // Save to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({
        stack: navigationStack,
        index: currentStackIndex
      }));
    }
    
    previousPathnameRef.current = pathname;
  }

  // Calculate navigation state during rendering (no effects needed!)
  const canGoBack = currentStackIndex > 0;
  const canGoForward = currentStackIndex < navigationStack.length - 1;

  // Calculate page title during rendering
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  // Event handlers - update state here, not in effects
  const handleBack = useCallback(() => {
    if (currentStackIndex <= 0) return;
    
    currentStackIndex--;
    const targetPath = navigationStack[currentStackIndex];
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({
        stack: navigationStack,
        index: currentStackIndex
      }));
    }
    
    // Force re-render and navigate
    setRenderTick(t => t + 1);
    router.push(targetPath);
  }, [router]);

  const handleForward = useCallback(() => {
    if (currentStackIndex >= navigationStack.length - 1) return;
    
    currentStackIndex++;
    const targetPath = navigationStack[currentStackIndex];
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({
        stack: navigationStack,
        index: currentStackIndex
      }));
    }
    
    // Force re-render and navigate
    setRenderTick(t => t + 1);
    router.push(targetPath);
  }, [router]);

  // Handle browser's native back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const pathIndex = navigationStack.indexOf(currentPath);
      
      if (pathIndex !== -1) {
        currentStackIndex = pathIndex;
        sessionStorage.setItem("navState", JSON.stringify({
          stack: navigationStack,
          index: currentStackIndex
        }));
        setRenderTick(t => t + 1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleForward();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleBack, handleForward]);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {!isSidebarOpen && (
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PiSidebar size={18} />
          </button>
        )}

        <div className={styles.navArrows}>
          <button
            type="button"
            className={`${styles.iconButton} ${canGoBack ? styles.iconButtonActive : styles.iconButtonDisabled}`}
            onClick={handleBack}
            disabled={!canGoBack}
            data-title="Back"
            aria-label="Go back"
          >
            <IoChevronBack size={16} />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${canGoForward ? styles.iconButtonActive : styles.iconButtonDisabled}`}
            onClick={handleForward}
            disabled={!canGoForward}
            data-title="Forward"
            aria-label="Go forward"
          >
            <IoChevronForward size={16} />
          </button>
        </div>

        {pageTitle && (
          <div className={styles.pageTitle}>
            <span>{pageTitle}</span>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <a 
          href="https://discord.com/invite/8Q9Nb2fATj" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.iconButton} 
          data-title="Join Discord"
          aria-label="Join Discord"
        >
          <PiDiscordLogo size={18} />
        </a>

        <button 
          type="button" 
          className={styles.iconButton} 
          data-title="Timer App"
          aria-label="Timer App"
        >
          <IoTimeOutline size={18} />
        </button>

        <button 
          type="button" 
          className={styles.iconButton} 
          data-title="Calendar App"
          aria-label="Calendar App"
        >
          <IoCalendarOutline size={16} />
        </button>

        <button 
          type="button" 
          className={styles.iconButton} 
          data-title="Notifications"
          aria-label="Notifications"
        >
          <FiBell size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;