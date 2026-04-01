import React from "react";
import styles from "./QuestionMeta.module.css";
// Kept FiTarget in case you want to use it later, but removed unused warnings

interface QuestionMetaProps {
  chapter: string;
  topic: string;
}

export const QuestionMeta = ({ chapter, topic }: QuestionMetaProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        Chapter & Topic
      </div>
      
      <div className={styles.content}>
        {chapter} 
        <span className={styles.separator}>•</span> 
        {topic}
      </div>
    </div>
  );
};