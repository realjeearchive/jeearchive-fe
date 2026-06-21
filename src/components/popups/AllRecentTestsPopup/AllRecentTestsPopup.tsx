"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FiX, FiBarChart2, FiBookOpen, FiActivity } from "react-icons/fi";
import styles from "./AllRecentTestsPopup.module.css";

interface RecentTestUI {
  id: string;
  title: string;
  meta: string;
  status: "COMPLETED" | "IN_PROGRESS";
  score: number;
  totalMarks: number;
  date: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: RecentTestUI[];
}

export default function AllRecentTestsPopup({ isOpen, onClose, data }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <FiActivity />
            </div>
            <h3 className={styles.title}>All Recent Activity</h3>
          </div>
          <button 
            className={styles.closeIconBtn} 
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.list} role="list">
            {data.map((test, index) => (
              <div key={`${test.id}-${index}`} className={styles.row} role="listitem">
                <div className={styles.info}>
                  <span className={styles.testTitle}>{test.title}</span>
                  <span className={styles.meta}>{test.date}</span>
                </div>

                <div className={styles.right}>
                  <span className={styles.score}>
                    {test.score}<span className={styles.max}>/{test.totalMarks}</span>
                  </span>

                  <button
                    className={styles.actionBtn}
                    onClick={() => router.push(`/analytics/tests/${test.id}`)}
                    title="View Analytics"
                    aria-label={`View analytics for ${test.title}`}
                  >
                    <FiBarChart2 size={14} aria-hidden="true" />
                    <span className={styles.btnText}>Analytics</span>
                  </button>

                  <button
                    className={styles.actionBtn}
                    onClick={() => router.push(`/solutions/${test.id}`)}
                    title="View Solutions"
                    aria-label={`View solutions for ${test.title}`}
                  >
                    <FiBookOpen size={14} aria-hidden="true" />
                    <span className={styles.btnText}>Solutions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
