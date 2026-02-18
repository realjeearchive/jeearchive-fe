"use client";

import React from "react";
import styles from "./SolutionContent.module.css";

interface SolutionContentProps {
  solutionText: string;
  isVisible: boolean; // Controlled by parent
}

export const SolutionContent = ({ solutionText, isVisible }: SolutionContentProps) => {

  if (!isVisible) return null;

  return (
    <div className={styles.container} id="detailed-solution-section">
      <div className={styles.header}>
        <div className={styles.title}>Detailed Solution</div>
      </div>

      <div 
        className={styles.body} 
        dangerouslySetInnerHTML={{ __html: solutionText }} 
      />

    </div>
  );
};