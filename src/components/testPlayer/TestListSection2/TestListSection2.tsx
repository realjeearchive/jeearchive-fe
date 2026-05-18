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
  onViewAnalytics: (paperId: string) => void; 
  onViewSolutions: (paperId: string) => void;
}

const TestListSection2: React.FC<TestListSectionProps> = ({ 
  heading, 
  items, 
  hideRestart = false, 
  onStart,
  onResume,
  onRestart,
  onViewAnalytics,
  onViewSolutions
}) => {
  // 🔥 NEW: State to manage the custom confirmation popup
  const [restartModal, setRestartModal] = useState<{ isOpen: boolean; testId: string | null }>({
    isOpen: false,
    testId: null,
  });

  // Intercept the restart click to show the modal instead of an alert
  const handleRestartClick = (id: string) => {
    setRestartModal({ isOpen: true, testId: id });
  };

  // Confirm the restart and fire the actual prop function
  const confirmRestart = () => {
    if (restartModal.testId) {
      onRestart(restartModal.testId);
    }
    setRestartModal({ isOpen: false, testId: null });
  };

  const closeModal = () => {
    setRestartModal({ isOpen: false, testId: null });
  };

  const renderButtons = (item: TestCardItem) => {
    // --- CASE 1: Test Completed ---
    if (item.status === "COMPLETED") {
      return (
        <div className={styles.actionsRow}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onViewAnalytics(item.id)}>
            <FiBarChart2 size={14} /> Analytics
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => onViewSolutions(item.id)}>
            <FiBookOpen size={14} /> Solutions
          </button>
          
          {!hideRestart && (
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => handleRestartClick(item.id)}>
              <FiRefreshCw size={14} /> Restart
            </button>
          )}
        </div>
      );
    }

    // --- CASE 2: In Progress / Paused ---
    if ((item.status === "IN_PROGRESS" || item.status === "PAUSED") && item.sessionId) {
      return (
        <div className={styles.actionsRow}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onResume(item.id, item.sessionId!)}>
            <FiPlay size={14} /> Resume Test
          </button>
          
          {!hideRestart && (
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => handleRestartClick(item.id)}>
              <FiRefreshCw size={14} /> Restart
            </button>
          )}
        </div>
      );
    }

    // --- CASE 3: Never Attempted (Default) ---
    return (
      <div className={styles.actionsRow}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onStart(item.id)}>
          <FiPlay size={14} /> Take Test
        </button>
      </div>
    );
  };

  return (
    <>
      <section className={styles.section}>
        {heading && (
          <div className={styles.sectionHeader}>
            <h2 className={styles.heading}>{heading}</h2>
          </div>
        )}

        <div className={styles.cardGrid}>
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className={styles.card}>
              
              <div className={styles.cardContent}>
                <div className={styles.headerRow}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <div 
                    className={`${styles.statusDot} ${
                      item.status === 'COMPLETED' ? styles.dotCompleted : 
                      item.status === 'IN_PROGRESS' || item.status === 'PAUSED' ? styles.dotActive : 
                      styles.dotNone
                    }`} 
                  />
                </div>
                <p className={styles.meta}>{item.meta}</p>
              </div>

              <div className={styles.cardFooter}>
                {renderButtons(item)}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 🔥 REFINED: Minimal Confirmation Modal */}
      {restartModal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconWrapper}>
              <FiAlertTriangle size={18} className={styles.modalIcon} />
            </div>
            <h3 className={styles.modalTitle}>Restart Test?</h3>
            <p className={styles.modalDesc}>
              This will clear your previous progress.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={closeModal}>
                Cancel
              </button>
              <button className={styles.modalBtnConfirm} onClick={confirmRestart}>
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