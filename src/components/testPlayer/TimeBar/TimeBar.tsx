"use client";

import { useEffect } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TimeBar.module.css";

// Helper to format 10800s -> "03:00:00"
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  
  if (parseInt(h) > 0) return `${h}:${m}:${s}`;
  return `${m}:${s}`;
}

export function TimeBar() {
  const timeLeftSeconds = useTestEngineStore((s) => s.timeLeftSeconds);
  const tickTimer = useTestEngineStore((s) => s.tickTimer);
  const isInitialized = useTestEngineStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Tick every second
    const id = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(id);
  }, [isInitialized, tickTimer]);

  return (
    <div className={styles.root}>
      <span className={styles.left}>Sections</span>
      <span className={`${styles.right} ${timeLeftSeconds < 300 ? styles.critical : ''}`}>
        Time Left : {formatTime(timeLeftSeconds)}
      </span>
    </div>
  );
}