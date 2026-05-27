"use client";

import { IoIosPaper } from "react-icons/io";
import styles from "./StatusIcon.module.css";
import type { QuestionStatus } from "@/features/tests/playertypes";

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

  const isAnsweredMarked =
    type === "answeredAndMarked" || type === "answeredMarked";

  return (
    <div
      className={[
        styles.iconBase,
        getStyleClass(type),
        isCurrent ? styles.current : "",
      ].join(" ")}
      role="img"
      aria-label={`Question status: ${type}${value !== undefined ? `, ${value}` : ""}`}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {value !== undefined && (
        <span className={styles.value}>{value}</span>
      )}

      {isAnsweredMarked && (
        <span className={styles.answeredMarkedInner} aria-hidden="true">
          <IoIosPaper />
        </span>
      )}
    </div>
  );
}