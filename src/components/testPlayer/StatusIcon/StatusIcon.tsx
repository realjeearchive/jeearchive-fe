"use client";

import { IoIosPaper } from "react-icons/io";
import styles from "./StatusIcon.module.css";
// Import the source of truth for types
import type { QuestionStatus } from "@/features/tests/playertypes";

// We define a union so it accepts both the Engine Status AND legacy strings (if you used them in static popups)
export type StatusIconInput = QuestionStatus | "marked" | "answeredMarked";

interface StatusIconProps {
  type: StatusIconInput;
  value?: number | string;
  isCurrent?: boolean;
  width?: number;
  height?: number;
}

export default function StatusIcon({
  type,
  value,
  isCurrent = false,
  width,
  height,
}: StatusIconProps) {

  // Helper to map incoming Status -> CSS Class Name
  const getStyleClass = (t: StatusIconInput) => {
    switch (t) {
      case "markedForReview":
      case "marked":
        return styles.marked;
        
      case "answeredAndMarked":
      case "answeredMarked":
        return styles.answeredMarked;
        
      case "answered":
        return styles.answered;
        
      case "notAnswered":
        return styles.notAnswered;
        
      case "notVisited":
      default:
        return styles.notVisited;
    }
  };

  const isAnsweredMarked = type === "answeredAndMarked" || type === "answeredMarked";

  return (
    <div
      className={[
        styles.iconBase,
        getStyleClass(type),
        isCurrent ? styles.current : "",
      ].join(" ")}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {value !== undefined && (
        <span className={styles.value}>{value}</span>
      )}

      {/* Inner green circle only for Answered & Marked */}
      {isAnsweredMarked && (
        <span className={styles.answeredMarkedInner}>
          <IoIosPaper />
        </span>
      )}
    </div>
  );
}