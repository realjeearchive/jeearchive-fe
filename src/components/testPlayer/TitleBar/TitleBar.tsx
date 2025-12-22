"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TitleBar.module.css";

interface TitleBarProps {
  year: string;
}

export function TitleBar({ year }: TitleBarProps) {
  const title = useTestEngineStore((s) => s.title);

  return (
    <div className={styles.root}>
      <div className={styles.badge}>
        JEE Main {year} {title}
      </div>
    </div>
  );
}
