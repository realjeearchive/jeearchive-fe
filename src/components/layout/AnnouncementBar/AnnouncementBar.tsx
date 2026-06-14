"use client";

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import styles from "./AnnouncementBar.module.css";

export interface AnnouncementData {
  id: string;
  type: "MAINTENANCE" | "UPDATE" | "INFO";
  message: string;
  shortMessage?: string; // Mobile-friendly string
  endTime: string | null;
}

const IS_FEATURE_ENABLED = false;

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!IS_FEATURE_ENABLED) return;

    let isMounted = true;

    const fetchAnnouncement = async () => {
      try {
        // --- SIMULATED BACKEND RESPONSE ---
        const data: AnnouncementData = {
          id: "maintenance-pyq-2024",
          type: "MAINTENANCE",
          message: "We are actively adding new 2024–2025 PYQs. The site may experience slowdowns for the next",
          shortMessage: "Maintenance in progress", 
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        };
        // ----------------------------------

        if (!isMounted) return;

        const dismissed = localStorage.getItem(`announcement-${data.id}-dismissed`);

        if (!dismissed) {
          const timer = setTimeout(() => {
            setAnnouncement(data);
            setIsVisible(true);
          }, 0);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Failed to fetch announcement data", error);
      }
    };

    fetchAnnouncement();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!announcement?.endTime || (!isVisible && !IS_FEATURE_ENABLED)) return;

    const targetTime = new Date(announcement.endTime).getTime();

    const updateTimer = () => {
      const diffSeconds = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft(diffSeconds);
    };

    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [announcement, isVisible]);

  if (!IS_FEATURE_ENABLED || !isVisible || !announcement) return null;

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`announcement-${announcement.id}-dismissed`, "true");
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const hStr = h > 0 ? `${String(h).padStart(2, "0")}h ` : "";
    return `${hStr}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const typeMap = {
    MAINTENANCE: { label: "Maintenance", mod: "warning" },
    UPDATE:      { label: "New",         mod: "info"    },
    INFO:        { label: "Info",        mod: "info"    },
  };

  const { label, mod } = typeMap[announcement.type];

  return (
    <div className={`${styles.bar} ${styles[`bar--${mod}`]}`}>
      <div className={styles.inner}>
        <span className={`${styles.dot} ${styles[`dot--${mod}`]}`} />
        <span className={`${styles.label} ${styles[`label--${mod}`]}`}>
          {label}
        </span>
        <span className={styles.sep} />
        
        <p className={styles.message}>
          {/* 🔥 Desktop full message */}
          <span className={styles.desktopText} title={announcement.message}>
            {announcement.message}
          </span>
          
          {/* 🔥 Mobile short message fallback */}
          <span className={styles.mobileText} title={announcement.shortMessage || announcement.message}>
            {announcement.shortMessage || announcement.message}
          </span>

          {timeLeft !== null && timeLeft > 0 && (
            <span className={`${styles.timer} ${styles[`timer--${mod}`]}`}>
              {formatTime(timeLeft)}
            </span>
          )}
        </p>
      </div>

      <button
        onClick={handleClose}
        className={styles.closeBtn}
        aria-label="Dismiss announcement"
      >
        <FiX size={14} strokeWidth={2} />
      </button>
    </div>
  );
}