"use client";

import { IoIosPaper } from "react-icons/io";
import styles from "./StatusIcon.module.css";

export type StatusIconType =
  | "answered"
  | "notAnswered"
  | "notVisited"
  | "marked"
  | "answeredMarked";

interface StatusIconProps {
  type: StatusIconType;
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
  return (
    <div
      className={[
        styles.iconBase,
        styles[type],
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
      {type === "answeredMarked" && (
        <span className={styles.answeredMarkedInner}>
          <IoIosPaper />
        </span>
      )}
    </div>
  );
}
