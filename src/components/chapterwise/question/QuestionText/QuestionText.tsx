import React from "react";
import styles from "./QuestionText.module.css";

interface QuestionTextProps {
  content: string; // HTML string
  hasImage?: boolean;
  imageUrl?: string;
}

export const QuestionText = ({ content, hasImage, imageUrl }: QuestionTextProps) => {
  return (
    <div className={styles.container}>
      <div 
        className={styles.htmlContent}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      
      {hasImage && imageUrl && (
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt="Question Diagram" className={styles.questionImage} />
        </div>
      )}
    </div>
  );
};