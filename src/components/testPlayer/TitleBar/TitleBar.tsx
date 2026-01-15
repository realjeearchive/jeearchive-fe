"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TitleBar.module.css";

export function TitleBar() {
  const title = useTestEngineStore((s) => s.title);
  const metadata = useTestEngineStore((s) => s.metadata);


  if (!metadata) {
    return (
      <div className={styles.root}>
        <div className={styles.badge}>
          {title || "Mock Test"}
        </div>
      </div>
    );
  }

  // 2. Format Exam Name (e.g., "JEE_MAIN" -> "JEE Main")
  const examName = (metadata.exam || "JEE Main")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters

  // 3. Construct the Array of parts
  // We strictly follow the order: Exam Name -> Year -> Date -> Month -> Shift
  const parts = [
    examName,
    metadata.year,
    metadata.date,
    metadata.month,
    metadata.shift
  ];

  // 4. Join them cleanly
  // .filter(Boolean) removes null, undefined, or empty strings ""
  // .join(" ") puts a single space between valid items
  const displayString = parts.filter(Boolean).join(" ");

  return (
    <div className={styles.root}>
      <div className={styles.badge}>
        {displayString}
      </div>
    </div>
  );
}