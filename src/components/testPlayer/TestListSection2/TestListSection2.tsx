"use client";

import React, { useState } from "react";
import { FiPlay, FiBarChart2, FiBookOpen, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
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
  // 🔥 FIX: Change these from paperId to sessionId
  onViewAnalytics: (sessionId: string) => void;
  onViewSolutions: (sessionId: string) => void;
}

const STATUS_LABELS: Record<TestCardItem["status"], string> = {
  COMPLETED: "Test completed",
  IN_PROGRESS: "Test in progress",
  PAUSED: "Test paused",
  NOT_ATTEMPTED: "Test not attempted",
};

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
  }>({
    isOpen: false,
    testId: null,
  });

  const handleRestartClick = (id: string) => {
    setRestartModal({ isOpen: true, testId: id });
  };

  const confirmRestart = () => {
    if (restartModal.testId) {
      onRestart(restartModal.testId);
    }
    setRestartModal({ isOpen: false, testId: null });
  };

  const closeModal = () => {
    setRestartModal({ isOpen: false, testId: null });
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && restartModal.isOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [restartModal.isOpen]);

  const renderButtons = (item: TestCardItem) => {
    if (item.status === "COMPLETED") {
      return (
        <div className={styles.actionsRow}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            // 🔥 FIX: Pass sessionId instead of paperId
            onClick={() => item.sessionId && onViewAnalytics(item.sessionId)}
            aria-label={`View analytics for ${item.title}`}
          >
            <FiBarChart2 size={14} aria-hidden="true" />
            Analytics
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            // 🔥 FIX: Pass sessionId instead of paperId
            onClick={() => item.sessionId && onViewSolutions(item.sessionId)}
            aria-label={`View solutions for ${item.title}`}
          >
            <FiBookOpen size={14} aria-hidden="true" />
            Solutions
          </button>
          {!hideRestart && (
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => handleRestartClick(item.id)}
              aria-label={`Restart ${item.title}`}
            >
              <FiRefreshCw size={14} aria-hidden="true" />
              Restart
            </button>
          )}
        </div>
      );
    }

    if ((item.status === "IN_PROGRESS" || item.status === "PAUSED") && item.sessionId) {
      return (
        <div className={styles.actionsRow}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onResume(item.id, item.sessionId!)}
            aria-label={`Resume ${item.title}`}
          >
            <FiPlay size={14} aria-hidden="true" />
            Resume Test
          </button>
          {!hideRestart && (
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => handleRestartClick(item.id)}
              aria-label={`Restart ${item.title}`}
            >
              <FiRefreshCw size={14} aria-hidden="true" />
              Restart
            </button>
          )}
        </div>
      );
    }

    return (
      <div className={styles.actionsRow}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
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
      <section className={styles.section} aria-label={heading || "Test papers list"}>
        {heading && (
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>{heading}</h2>
          </div>
        )}

        <div className={styles.cardGrid} role="list">
          {items.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className={styles.card}
              role="listitem"
              aria-label={item.title}
            >
              <div className={styles.cardContent}>
                <div className={styles.headerRow}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <div
                    className={`${styles.statusDot} ${
                      item.status === "COMPLETED"
                        ? styles.dotCompleted
                        : item.status === "IN_PROGRESS" || item.status === "PAUSED"
                        ? styles.dotActive
                        : styles.dotNone
                    }`}
                    aria-label={STATUS_LABELS[item.status]}
                    role="status"
                  />
                </div>
                <p className={styles.meta}>{item.meta}</p>
              </div>

              <div className={styles.cardFooter}>{renderButtons(item)}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Confirmation Modal */}
      {restartModal.isOpen && (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="restart-modal-title"
          aria-describedby="restart-modal-desc"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconWrapper} aria-hidden="true">
              <FiAlertTriangle size={18} className={styles.modalIcon} />
            </div>
            <h3 id="restart-modal-title" className={styles.modalTitle}>
              Restart Test?
            </h3>
            <p id="restart-modal-desc" className={styles.modalDesc}>
              This will clear your previous progress.
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