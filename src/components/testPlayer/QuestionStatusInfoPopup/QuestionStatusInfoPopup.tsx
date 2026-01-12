// QuestionStatusInfoPopup.tsx

"use client";

import styles from "./QuestionStatusInfoPopup.module.css";
import StatusButton from "../StatusButton/StatusButton";

export default function QuestionStatusInfoPopup() {
  return (
    <div className={styles.popup}>
      <div className={styles.row}>
        <StatusButton label="1" variant="primary" />
        <span>Answered</span>
      </div>

      <div className={styles.row}>
        <StatusButton label="3" variant="outline" />
        <span>Not Answered</span>
      </div>

      <div className={styles.row}>
        <StatusButton label="0" variant="outline" />
        <span>Not Visited</span>
      </div>

      <div className={styles.row}>
        <StatusButton label="1" variant="outline" />
        <span>Marked for Review</span>
      </div>

      <div className={styles.row}>
        <StatusButton label="0" variant="outline" />
        <span>
          Answered and Marked for Review
          <br />
          <small>(will also be evaluated)</small>
        </span>
      </div>
    </div>
  );
}
