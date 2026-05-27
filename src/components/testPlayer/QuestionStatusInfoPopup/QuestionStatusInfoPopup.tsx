"use client";

import styles from "./QuestionStatusInfoPopup.module.css";
import StatusButton from "../StatusButton/StatusButton";

export default function QuestionStatusInfoPopup() {
  return (
    <div className={styles.popup} role="list" aria-label="Question status legend">
      <div className={styles.row} role="listitem">
        <StatusButton label="1" variant="primary" aria-hidden="true" />
        <span>Answered</span>
      </div>

      <div className={styles.row} role="listitem">
        <StatusButton label="3" variant="outline" aria-hidden="true" />
        <span>Not Answered</span>
      </div>

      <div className={styles.row} role="listitem">
        <StatusButton label="0" variant="outline" aria-hidden="true" />
        <span>Not Visited</span>
      </div>

      <div className={styles.row} role="listitem">
        <StatusButton label="1" variant="outline" aria-hidden="true" />
        <span>Marked for Review</span>
      </div>

      <div className={styles.row} role="listitem">
        <StatusButton label="0" variant="outline" aria-hidden="true" />
        <span>
          Answered and Marked for Review
          <br />
          <small>(will also be evaluated)</small>
        </span>
      </div>
    </div>
  );
}