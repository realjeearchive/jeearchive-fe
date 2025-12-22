"use client";

import { useEffect } from "react";
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
  const tickTimer = useTestEngineStore((s) => s.tickTimer);
  const testId = useTestEngineStore((s) => s.testId);

  useEffect(() => {
    if (!testId) return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [testId, tickTimer]);

  return (
    <div className={styles.root}>
      <span className={styles.left}>Sections</span>
      <span className={styles.right}>
        Time Left : {formatTime(timeLeftSeconds)}
      </span>
    </div>
  );
}
