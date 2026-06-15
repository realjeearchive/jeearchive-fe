"use client";

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import styles from "./AnnouncementBar.module.css";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";

export default function AnnouncementBar() {
  const { banner, fetchBanner } = useAnnouncementStore();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch the data from the backend when the layout mounts
  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  useEffect(() => {
    if (!banner) return;

    let timer: NodeJS.Timeout;

    // 🔥 BACKEND KILL SWITCH: If isbanner is false, do not show it
    if (!banner.isbanner) {
      // Wrapped in setTimeout to prevent synchronous cascading render warning
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Use backend ID to track dismissals
    const dismissed = localStorage.getItem(`announcement-${banner.id}-dismissed`);

    if (!dismissed) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  useEffect(() => {
    if (!banner?.endTime || !isVisible) return;

    const targetTime = new Date(banner.endTime).getTime();

    const updateTimer = () => {
      const diffSeconds = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft(diffSeconds);
    };

    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [banner, isVisible]);

  // Return null if data hasn't loaded, or if backend turned it off, or if user dismissed it
  if (!banner || !banner.isbanner || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`announcement-${banner.id}-dismissed`, "true");
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const hStr = h > 0 ? `${String(h).padStart(2, "0")}h ` : "";
    return `${hStr}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  // Safely map backend "Maintenance" -> "MAINTENANCE"
  const rawType = (banner.type || "INFO").toUpperCase();
  const mappedType = ["MAINTENANCE", "UPDATE", "INFO"].includes(rawType)
    ? (rawType as "MAINTENANCE" | "UPDATE" | "INFO")
    : "INFO";

  const typeMap = {
    MAINTENANCE: { label: "Maintenance", mod: "warning" },
    UPDATE:      { label: "New",         mod: "info"    },
    INFO:        { label: "Info",        mod: "info"    },
  };

  const { label, mod } = typeMap[mappedType];

  return (
    <div className={`${styles.bar} ${styles[`bar--${mod}`]}`}>
      <div className={styles.inner}>
        <span className={`${styles.dot} ${styles[`dot--${mod}`]}`} />
        <span className={`${styles.label} ${styles[`label--${mod}`]}`}>
          {label}
        </span>
        <span className={styles.sep} />
        
        <p className={styles.message}>
          {/* Desktop full message */}
          <span className={styles.desktopText} title={banner.reason}>
            {banner.reason}
          </span>
          
          {/* Mobile message */}
          <span className={styles.mobileText} title={banner.reason}>
            {banner.reason}
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