import React from "react";
import styles from "./QuestionStats.module.css";
import { FiClock, FiTarget } from "react-icons/fi";

interface QuestionStatsProps {
  userTime: string;
  avgTime: string;
  accuracy: number;
}

export const QuestionStats = ({
  userTime,
  avgTime,
  accuracy,
}: QuestionStatsProps) => {
  let colorClass = styles.bgOrange;
  let textClass = styles.textOrange;

  if (accuracy >= 70) {
    colorClass = styles.bgGreen;
    textClass = styles.textGreen;
  } else if (accuracy < 40) {
    colorClass = styles.bgRed;
    textClass = styles.textRed;
  }

  return (
    <section className={styles.container} aria-label="Question statistics">
      <div className={styles.statBlock}>
        <div className={`${styles.iconWrapper} ${styles.iconTime}`} aria-hidden="true">
          <FiClock size={18} />
        </div>

        <div className={styles.content}>
          <div className={styles.label}>Time Spent</div>
          <div className={styles.mainValueRow}>
            <div className={styles.mainValue}>{userTime}</div>
          </div>
          <div className={styles.subValue}>
            <span>Average Time: </span>
            {avgTime}
          </div>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.statBlock}>
        <div className={`${styles.iconWrapper} ${styles.iconAcc}`} aria-hidden="true">
          <FiTarget size={18} />
        </div>

        <div className={styles.content}>
          <div className={styles.label}>Global Accuracy</div>

          <div className={styles.barWrapper}>
            <div className={styles.barTrack}>
              <div
                className={`${styles.barFill} ${colorClass}`}
                style={{ width: `${accuracy}%` }}
                role="progressbar"
                aria-valuenow={accuracy}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${accuracy}% accuracy`}
              />
            </div>

            <div className={styles.barLabel}>
              <span className={textClass}>{accuracy}% Correct</span>
              <span>{100 - accuracy}% Wrong</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};