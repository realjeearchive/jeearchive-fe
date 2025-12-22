"use client";

import styles from "./StatusIndicator.module.css";
import StatusIcon from "@/components/testPlayer/StatusIcon/StatusIcon";

interface StatusCount {
  answered: number;
  notAnswered: number;
  notVisited: number;
  markedForReview: number;
  answeredAndMarked: number;
}

interface StatusIndicatorProps {
  counts?: StatusCount;
}

export function StatusIndicator({
  counts = {
    answered: 2,
    notAnswered: 1,
    notVisited: 19,
    markedForReview: 2,
    answeredAndMarked: 2,
  },
}: StatusIndicatorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.statusGrid}>
        {/* First Row */}
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <StatusIcon width={34} height={28} type="answered" value={counts.answered} />
            <div className={styles.statusText}>
              <span className={styles.statusLabel}>Answered</span>
            </div>
          </div>

          <div className={styles.statusItem}>
            <StatusIcon width={34} height={28} type="notAnswered" value={counts.notAnswered}  />
            <div className={styles.statusText}>
              <span className={styles.statusLabel}>Not Answered</span>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <StatusIcon width={34} height={34} type="notVisited" value={counts.notVisited} />
            <div className={styles.statusText}>
              <span className={styles.statusLabel}>Not Visited</span>
            </div>
          </div>

          <div className={styles.statusItem}>
            <StatusIcon type="marked" value={counts.markedForReview} />
            <div className={styles.statusText}>
              <span className={styles.statusLabel}>Marked for review</span>
            </div>
          </div>
        </div>

        {/* Third Row - Full Width */}
        <div className={styles.fullRow}>
          <div className={styles.statusItem}>
            <StatusIcon
              type="answeredMarked"
              value={counts.answeredAndMarked}
            />
            <div className={styles.statusText}>
              <span className={styles.statusLabel}>
                Answered and Marked for Review (will also be evaluated)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
