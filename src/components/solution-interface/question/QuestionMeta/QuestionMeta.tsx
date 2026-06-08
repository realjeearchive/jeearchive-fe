import React from "react";
import styles from "./QuestionMeta.module.css";

interface QuestionMetaProps {
  chapter: string;
  topic: string;
}

export const QuestionMeta = ({ chapter, topic }: QuestionMetaProps) => {
  return (
    <footer className={styles.container} aria-label="Question metadata">
      <div className={styles.label}>Chapter & Topic</div>

      <div className={styles.content}>
        {chapter}
        <span className={styles.separator} aria-hidden="true">
          •
        </span>
        {topic}
      </div>
    </footer>
  );
};