"use client";

import React, { useState } from "react";
import styles from "./SolutionContent.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import Latex from "@/components/testPlayer/Latex/Latex";

interface SolutionContentProps {
  solutionText: string;
  videoUrl?: string | null; 
}

export const SolutionContent = ({ solutionText, videoUrl }: SolutionContentProps) => {
  const [showVideo, setShowVideo] = useState(false);

  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'text') {
         if (domNode.data && domNode.data.trim() !== '') {
             return <Latex>{domNode.data}</Latex>;
         }
      }
      
      if (domNode.type === 'tag') {
        const element = domNode as Element;
        if (element.name === 'img') {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...element.attribs}
              className={styles.parsedImage} 
              alt={element.attribs.alt || "Solution Figure"}
            />
          );
        }
      }
    }
  };

  return (
    <div className={styles.container} id="detailed-solution-section">
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
           Detailed Solution
        </div>
        
        {videoUrl && (
          <button 
            className={styles.videoBadge}
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? "Hide Video" : "Watch Video"}
          </button>
        )}
      </div>

      {/* Text Body - Using Parser */}
      <div className={styles.body}>
        {solutionText ? parse(solutionText, parserOptions) : null}
      </div>

      {/* Video Embed */}
      {showVideo && videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe 
            src={videoUrl} 
            title="Solution Video" 
            allowFullScreen
          />
        </div>
      )}

    </div>
  );
};