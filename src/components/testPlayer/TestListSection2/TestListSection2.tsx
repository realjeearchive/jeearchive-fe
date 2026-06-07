"use client";

import React, { useState } from "react";
import {
  FiPlay,
  FiBarChart2,
  FiBookOpen,
  FiRefreshCw,
  FiAlertTriangle,
  FiSun,
  FiMoon,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import styles from "./TestListSection2.module.css";

export interface TestCardItem {
  id: string;
  title: string;
  meta: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PAUSED" | "NOT_ATTEMPTED";
  sessionId?: string;
}

interface TestListSectionProps {
  heading: string;
  items: TestCardItem[];
  hideRestart?: boolean;
  onStart: (paperId: string) => void;
  onResume: (paperId: string, sessionId: string) => void;
  onRestart: (paperId: string) => void;
  onViewAnalytics: (sessionId: string) => void;
  onViewSolutions: (sessionId: string) => void;
}

const STATUS_LABELS: Record<TestCardItem["status"], string> = {
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  PAUSED: "Paused",
  NOT_ATTEMPTED: "Not Attempted",
};

/** Derive a slot label ("Morning" / "Evening" / null) and which icon to show */
function getSlotInfo(title: string): {
  label: string | null;
  isMorning: boolean | null;
} {
  const lower = title.toLowerCase();
  if (lower.includes("morning")) return { label: "Morning", isMorning: true };
  if (lower.includes("evening")) return { label: "Evening", isMorning: false };
  return { label: null, isMorning: null };
}

/** Strip "Morning" / "Evening" from the title so it shows in the badge only */
function cleanTitle(title: string): string {
  return title
    .replace(/\(Morning\)/i, "")
    .replace(/\(Evening\)/i, "")
    .trim();
}

const TestListSection2: React.FC<TestListSectionProps> = ({
  heading,
  items,
  hideRestart = false,
  onStart,
  onResume,
  onRestart,
  onViewAnalytics,
  onViewSolutions,
}) => {
  const [restartModal, setRestartModal] = useState<{
    isOpen: boolean;
    testId: string | null;
  }>({ isOpen: false, testId: null });

  const handleRestartClick = (id: string) =>
    setRestartModal({ isOpen: true, testId: id });

  const confirmRestart = () => {
    if (restartModal.testId) onRestart(restartModal.testId);
    setRestartModal({ isOpen: false, testId: null });
  };

  const closeModal = () => setRestartModal({ isOpen: false, testId: null });

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && restartModal.isOpen) closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [restartModal.isOpen]);

  const renderActions = (item: TestCardItem) => {
    if (item.status === "COMPLETED") {
      return (
        <div className={styles.actionArea}>
          <div className={styles.actionRow}>
            <button
              className={`${styles.btn} ${styles.btnAnalytics}`}
              onClick={() => item.sessionId && onViewAnalytics(item.sessionId)}
              aria-label={`View analytics for ${item.title}`}
            >
              <FiBarChart2 size={14} aria-hidden="true" />
              Analytics
            </button>
            <button
              className={`${styles.btn} ${styles.btnSolutions}`}
              onClick={() => item.sessionId && onViewSolutions(item.sessionId)}
              aria-label={`View solutions for ${item.title}`}
            >
              <FiBookOpen size={14} aria-hidden="true" />
              Solutions
            </button>
          </div>
          {!hideRestart && (
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => handleRestartClick(item.id)}
              aria-label={`Restart ${item.title}`}
            >
              <FiRefreshCw size={12} aria-hidden="true" />
              Restart Test
            </button>
          )}
        </div>
      );
    }

    if (
      (item.status === "IN_PROGRESS" || item.status === "PAUSED") &&
      item.sessionId
    ) {
      return (
        <div className={styles.actionArea}>
          <button
            className={`${styles.btn} ${styles.btnResume}`}
            onClick={() => onResume(item.id, item.sessionId!)}
            aria-label={`Resume ${item.title}`}
          >
            <FiPlay size={14} aria-hidden="true" style={{ fill: "currentColor" }} />
            Resume Test
          </button>
          {!hideRestart && (
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => handleRestartClick(item.id)}
              aria-label={`Restart ${item.title}`}
            >
              <FiRefreshCw size={12} aria-hidden="true" />
              Restart
            </button>
          )}
        </div>
      );
    }

    // NOT_ATTEMPTED
    return (
      <div className={styles.actionArea}>
        <button
          className={`${styles.btn} ${styles.btnStart}`}
          onClick={() => onStart(item.id)}
          aria-label={`Start ${item.title}`}
        >
          <FiPlay size={14} aria-hidden="true" />
          Take Test
        </button>
      </div>
    );
  };

  return (
    <>
      <section
        className={styles.section}
        aria-label={heading || "Test papers list"}
      >
        {heading && (
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>{heading}</h2>
          </div>
        )}

        <div className={styles.cardGrid} role="list">
          {items.map((item, index) => {
            const isActive =
              item.status === "IN_PROGRESS" || item.status === "PAUSED";
            const isCompleted = item.status === "COMPLETED";
            const slot = getSlotInfo(item.title);
            const displayTitle = cleanTitle(item.title);

            return (
              <article
                key={`${item.id}-${index}`}
                className={`${styles.card} ${
                  isActive ? styles.cardActive : ""
                } ${isCompleted ? styles.cardCompleted : ""}`}
                role="listitem"
                aria-label={item.title}
              >
                {/* Top accent line for active cards */}
                {isActive && <div className={styles.cardAccentBar} aria-hidden="true" />}

                {/* Card Header */}
                <div className={styles.cardHeader}>
                  {/* Left: icon + slot badge */}
                  <div className={styles.iconBlock}>
                    <div
                      className={`${styles.slotIcon} ${
                        slot.isMorning === true
                          ? styles.slotIconMorning
                          : slot.isMorning === false
                          ? styles.slotIconEvening
                          : styles.slotIconNeutral
                      }`}
                      aria-hidden="true"
                    >
                      {slot.isMorning === true ? (
                        <FiSun size={16} />
                      ) : slot.isMorning === false ? (
                        <FiMoon size={16} />
                      ) : (
                        <FiFileText size={16} />
                      )}
                    </div>
                  </div>

                  {/* Right: status badge */}
                  <div
                    className={`${styles.statusBadge} ${
                      isCompleted
                        ? styles.badgeCompleted
                        : isActive
                        ? styles.badgeActive
                        : styles.badgeNone
                    }`}
                    role="status"
                    aria-label={STATUS_LABELS[item.status]}
                  >
                    <span className={styles.statusDot} aria-hidden="true" />
                    {STATUS_LABELS[item.status]}
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <h3 className={styles.title}>{displayTitle}</h3>
                  {slot.label && (
                    <span
                      className={`${styles.slotPill} ${
                        slot.isMorning ? styles.slotPillMorning : styles.slotPillEvening
                      }`}
                    >
                      {slot.label}
                    </span>
                  )}
                  <div className={styles.metaRow}>
                    <FiClock size={11} aria-hidden="true" />
                    <span>{item.meta}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} aria-hidden="true" />

                {/* Actions */}
                {renderActions(item)}
              </article>
            );
          })}
        </div>
      </section>

      {/* Restart Confirmation Modal */}
      {restartModal.isOpen && (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIconWrapper} aria-hidden="true">
              <FiAlertTriangle size={20} className={styles.modalIcon} />
            </div>
            <h3 id="modal-title" className={styles.modalTitle}>
              Restart Test?
            </h3>
            <p className={styles.modalDesc}>
              This will clear your previous progress and cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.modalBtnConfirm}
                onClick={confirmRestart}
                autoFocus
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestListSection2;
