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
  counts: StatusCount;
}

export function StatusIndicator({ counts }: StatusIndicatorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.statusGrid}>
        {/* Row 1 */}
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <StatusIcon width={30} height={30} type="answered" value={counts.answered} />
            <span className={styles.statusLabel}>Answered</span>
          </div>
          <div className={styles.statusItem}>
            <StatusIcon width={30} height={30} type="notAnswered" value={counts.notAnswered} />
            <span className={styles.statusLabel}>Not Answered</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <StatusIcon width={30} height={30} type="notVisited" value={counts.notVisited} />
            <span className={styles.statusLabel}>Not Visited</span>
          </div>
          <div className={styles.statusItem}>
            <StatusIcon width={30} height={30} type="markedForReview" value={counts.markedForReview} />
            <span className={styles.statusLabel}>Marked for Review</span>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.fullRow}>
          <div className={styles.statusItem}>
            <StatusIcon type="answeredAndMarked" value={counts.answeredAndMarked} width={30} height={30} />
            <span className={styles.statusLabel}>
              Answered & Marked for Review (will be evaluated)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}