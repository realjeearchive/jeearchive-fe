"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import styles from "./header.module.css";
// 🔥 Added PiFire (outline) alongside PiFireFill for that true "unfilled" look
import { PiSidebar, PiDiscordLogo, PiFireFill, PiFire } from "react-icons/pi";
import { IoChevronBack, IoChevronForward, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { FiBell, FiTarget } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store";
import { useStreakStore } from "@/store/useStreakStore";

import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationPopup } from "@/components/popups/NotificationPopup/NotificationPopup";
import { StreakPopup } from "@/components/popups/StreakPopup/StreakPopup";
import { DailyGoalPopup } from "@/components/popups/DailyGoalPopup/DailyGoalPopup";

interface HeaderProps {
  isSidebarToggled: boolean;
  toggleSidebar: () => void;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let navigationStack: string[] = [];
let currentStackIndex: number = -1;

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

const Header: React.FC<HeaderProps> = ({ isSidebarToggled, toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useUserStore((s) => s.profile);
  
  const { streak, loadStreak, isPopupOpen, setPopupOpen } = useStreakStore();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount, loadNotifications, markAsRead } = useNotificationStore();

  const [renderTick, setRenderTick] = useState(0);
  const previousPathnameRef = useRef(pathname);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const prevQuestionsToday = useRef<number | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    if (streak) {
      const currQuestions = streak.questionsToday || 0;
      const prevQuestions = prevQuestionsToday.current;

      // 🔥 ONLY show popup if we observe the transition from 0 to > 0 during THIS session.
      // This prevents it from showing multiple times if you switch to a laptop after solving on mobile.
      if (prevQuestions === 0 && currQuestions > 0) {
        setPopupOpen(true);
      }

      // Update ref for the next state change
      prevQuestionsToday.current = currQuestions;
    }
  }, [streak, profile?.id, setPopupOpen]);

  useEffect(() => {
    loadStreak();
    loadNotifications();
  }, [loadStreak, loadNotifications]);

  if (pathname !== previousPathnameRef.current) {
    const existingIndex = navigationStack.indexOf(pathname);
    
    if (existingIndex !== -1) {
      currentStackIndex = existingIndex;
    } else {
      navigationStack = [...navigationStack.slice(0, currentStackIndex + 1), pathname];
      currentStackIndex = navigationStack.length - 1;
    }
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({
        stack: navigationStack,
        index: currentStackIndex
      }));
    }
    
    previousPathnameRef.current = pathname;
  }

  const canGoBack = currentStackIndex > 0;
  const canGoForward = currentStackIndex < navigationStack.length - 1;
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  const handleBack = useCallback(() => {
    if (currentStackIndex <= 0) return;
    currentStackIndex--;
    const targetPath = navigationStack[currentStackIndex];
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({ stack: navigationStack, index: currentStackIndex }));
    }
    setRenderTick(t => t + 1);
    router.push(targetPath);
  }, [router]);

  const handleForward = useCallback(() => {
    if (currentStackIndex >= navigationStack.length - 1) return;
    currentStackIndex++;
    const targetPath = navigationStack[currentStackIndex];
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navState", JSON.stringify({ stack: navigationStack, index: currentStackIndex }));
    }
    setRenderTick(t => t + 1);
    router.push(targetPath);
  }, [router]);

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const pathIndex = navigationStack.indexOf(currentPath);
      
      if (pathIndex !== -1) {
        currentStackIndex = pathIndex;
        sessionStorage.setItem("navState", JSON.stringify({ stack: navigationStack, index: currentStackIndex }));
        setRenderTick(t => t + 1);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  // 🔥 LEETCODE LOGIC: Streak is only colored/filled if the user HAS SOLVED something TODAY.
  const currentStreak = streak?.currentStreak || 0;
  const hasCompletedToday = (streak?.questionsToday || 0) > 0;
  const streakColorClass = hasCompletedToday ? styles.streakActive : styles.streakDefault;

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={`${styles.sidebarToggle} ${isSidebarToggled ? styles.toggled : ""}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          data-title="Toggle sidebar"
        >
          <PiSidebar size={18} />
        </button>

        <div className={styles.navArrows}>
          <button
            type="button"
            className={`${styles.iconButton} ${canGoBack ? styles.iconButtonActive : styles.iconButtonDisabled}`}
            onClick={handleBack}
            disabled={!canGoBack}
            data-title="Go back (Alt + ←)"
          >
            <IoChevronBack size={16} />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${canGoForward ? styles.iconButtonActive : styles.iconButtonDisabled}`}
            onClick={handleForward}
            disabled={!canGoForward}
            data-title="Go forward (Alt + →)"
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
        <button 
          type="button" 
          className={`${styles.streakItem} ${streakColorClass}`} 
          data-title={`Max Streak: ${streak?.maxStreak || 0}`}
        >
          <span className={styles.streakText}>{currentStreak}</span>
          {/* 🔥 Swaps between a solid icon and an outline icon based on today's status */}
          {hasCompletedToday ? (
            <PiFireFill size={18} className={styles.streakIcon} />
          ) : (
            <PiFire size={18} className={styles.streakIcon} />
          )}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            id="daily-goal-btn"
            type="button" 
            className={styles.iconButton} 
            data-title="Daily Goals"
            onClick={() => setIsGoalOpen(!isGoalOpen)}
          >
            <FiTarget size={16} />
          </button>
          
          <DailyGoalPopup 
            isOpen={isGoalOpen} 
            onClose={() => setIsGoalOpen(false)} 
          />
        </div>
        
        <a 
          href="https://discord.com/invite/8Q9Nb2fATj" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.iconButton} 
          data-title="Join Discord"
        >
          <PiDiscordLogo size={18} />
        </a>

        <a 
          href="https://timer.jeearchive.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconButton} 
          data-title="Timer App"
        >
          <IoTimeOutline size={18} />
        </a>

        <button 
          type="button" 
          className={`${styles.iconButton} ${styles.comingSoon}`} 
          data-title="Calendar (Coming Soon)"
          onClick={(e) => e.preventDefault()}
        >
          <IoCalendarOutline size={16} />
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            id="notification-bell-btn"
            type="button" 
            className={styles.iconButton} 
            data-title="Notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <FiBell size={16} />
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount}</span>
            )}
          </button>
          
          <NotificationPopup 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
            notifications={notifications}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>

      <StreakPopup 
        isOpen={isPopupOpen} 
        onClose={() => setPopupOpen(false)} 
        streakCount={currentStreak} 
      />

    </header>
  );
};

export default Header;