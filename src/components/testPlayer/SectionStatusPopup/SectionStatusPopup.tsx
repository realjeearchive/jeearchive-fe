// SectionStatusPopup.tsx

"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import styles from "./SectionStatusPopup.module.css";
import StatusIcon from "../StatusIcon/StatusIcon";

interface Props {
  anchorRect: DOMRect;
  onClose: () => void;
}

export function SectionStatusPopup({ anchorRect, onClose }: Props) {
  // Close on scroll (exact CBT behavior)
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={styles.popup}
      style={{
        top: anchorRect.bottom + 8,
        left: anchorRect.left + anchorRect.width / 2,
        transform: "translateX(-50%)",
      }}
    >
      <div className={styles.row}>
        <StatusIcon type="answered" value={1} width={48} height={40} />
        <span>Answered</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="notAnswered" value={3} width={48} height={40} />
        <span>Not Answered</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="notVisited" value={0} width={48} height={40} />
        <span>Not Visited</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="marked" value={1} width={48} height={48} />
        <span>Marked for Review</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="answeredMarked" value={0} width={48} height={48} />
        <span>
          Answered and Marked for Review
          <br />
          <small>(will also be evaluated)</small>
        </span>
      </div>
    </div>,
    document.body
  );
}
