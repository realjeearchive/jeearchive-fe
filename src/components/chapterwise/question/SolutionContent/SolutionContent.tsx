"use client";

import React, { useState } from "react";
import styles from "./SolutionContent.module.css";

interface SolutionContentProps {
  solutionText: string;
  isVisible: boolean; // Controlled by parent
}

export const SolutionContent = ({ solutionText, isVisible }: SolutionContentProps) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!isVisible) return null;

  return (
    <div className={styles.container} id="detailed-solution-section">
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>Detailed Solution</div>
        
        {/* Placeholder for video toggle if you have video data later */}
        {/* <button className={styles.videoBadge}>Watch Video</button> */}
      </div>

      {/* Body */}
      <div 
        className={styles.body} 
        dangerouslySetInnerHTML={{ __html: solutionText }} 
      />

    </div>
  );
};