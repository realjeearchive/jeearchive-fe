"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TitleBar.module.css";

export function TitleBar() {
  const title = useTestEngineStore((s) => s.title);

  return (
    <div className={styles.root}>
      <h1 className={styles.badge}>{title || "Mock Test"}</h1>
    </div>
  );
}