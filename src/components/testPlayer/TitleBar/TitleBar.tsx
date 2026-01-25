"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TitleBar.module.css";

export function TitleBar() {
  // We simply grab the pre-formatted title string from the store
  const title = useTestEngineStore((s) => s.title);

  return (
    <div className={styles.root}>
      <div className={styles.badge}>
        {title || "Mock Test"}
      </div>
    </div>
  );
}