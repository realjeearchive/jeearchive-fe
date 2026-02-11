import React from "react";
import styles from "./QuestionText.module.css";

interface QuestionTextProps {
  content: string; // HTML string or plain text
  hasImage?: boolean;
  imageUrl?: string;
}

export const QuestionText = ({ content, hasImage, imageUrl }: QuestionTextProps) => {
  return (
    <div className={styles.container}>
      {/* Ideally, you'd use a parser here for LaTeX/Math. 
        For now, we render simple text/HTML. 
      */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      {hasImage && imageUrl && (
        <img src={imageUrl} alt="Question Diagram" />
      )}
    </div>
  );
};