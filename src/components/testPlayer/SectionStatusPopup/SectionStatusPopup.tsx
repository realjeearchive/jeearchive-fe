"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import styles from "./SectionStatusPopup.module.css";
import StatusIcon from "../StatusIcon/StatusIcon";
import { useTestEngineStore } from "@/features/tests/testEngineStore";

interface Props {
  anchorRect: DOMRect;
  targetSectionId: string; // <--- NEW PROP: The specific section to show stats for
  onClose: () => void;
}

export function SectionStatusPopup({ anchorRect, targetSectionId, onClose }: Props) {
  // 1. Get Global Data (All sections and all question states)
  const sections = useTestEngineStore((s) => s.sections);
  const questionsById = useTestEngineStore((s) => s.questionsById);

  // Close on scroll (standard CBT behavior)
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [onClose]);

  // 2. Calculate Counts for the TARGET Section (not necessarily the active one)
  const counts = useMemo(() => {
    const currentCounts = {
      answered: 0,
      notAnswered: 0,
      notVisited: 0,
      markedForReview: 0,
      answeredAndMarked: 0,
    };

    if (!targetSectionId || !sections.length) return currentCounts;

    // Find the TARGET section definition
    const targetSection = sections.find((s) => s.id === targetSectionId);
    
    if (targetSection) {
      targetSection.questions.forEach((qDef) => {
        // Look up the live state for this question
        const state = questionsById[qDef.id];
        if (state) {
          switch (state.status) {
            case "answered":
              currentCounts.answered++;
              break;
            case "notAnswered":
              currentCounts.notAnswered++;
              break;
            case "notVisited":
              currentCounts.notVisited++;
              break;
            case "markedForReview":
              currentCounts.markedForReview++;
              break;
            case "answeredAndMarked":
              currentCounts.answeredAndMarked++;
              break;
          }
        }
      });
    }

    return currentCounts;
  }, [targetSectionId, sections, questionsById]);

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
        <StatusIcon type="answered" value={counts.answered} width={48} height={40} />
        <span>Answered</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="notAnswered" value={counts.notAnswered} width={48} height={40} />
        <span>Not Answered</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="notVisited" value={counts.notVisited} width={48} height={40} />
        <span>Not Visited</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="marked" value={counts.markedForReview} width={48} height={48} />
        <span>Marked for Review</span>
      </div>

      <div className={styles.row}>
        <StatusIcon type="answeredMarked" value={counts.answeredAndMarked} width={48} height={48} />
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