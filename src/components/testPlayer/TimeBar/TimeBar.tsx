"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TimeBar.module.css";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function TimeBar() {
  const timeLeftSeconds = useTestEngineStore((s) => s.timeLeftSeconds);

  return (
    <div className={styles.root} role="timer" aria-label="Time remaining">
      <span className={styles.left}>Sections</span>
      <span
        className={`${styles.right} ${timeLeftSeconds < 300 ? styles.critical : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        Time Left : {formatTime(timeLeftSeconds)}
      </span>
    </div>
  );
}