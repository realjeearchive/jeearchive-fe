import React, { useState } from "react";
import styles from "./SolutionContent.module.css";
import { FiBookOpen } from "react-icons/fi";

interface SolutionContentProps {
  solutionText: string;
  videoUrl?: string; // YouTube/Vimeo ID or URL
}

export const SolutionContent = ({ solutionText, videoUrl }: SolutionContentProps) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <FiBookOpen size={18} /> 
          Detailed Solution
        </div>
        
        {videoUrl && (
          <button 
            className={styles.videoBadge}
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? "Hide Video" : "Watch Video Solution"}
          </button>
        )}
      </div>

      {/* Text Solution */}
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: solutionText }} />

      {/* Video Embed (Conditional) */}
      {showVideo && videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe 
            src={videoUrl} 
            title="Video Solution" 
            allowFullScreen 
          />
        </div>
      )}
    </div>
  );
};