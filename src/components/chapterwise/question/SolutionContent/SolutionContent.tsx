"use client";

import React from "react";
import styles from "./SolutionContent.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import Latex from "@/components/testPlayer/Latex/Latex"; 

interface SolutionContentProps {
  solutionText: string;
  isVisible: boolean; // Controlled by parent in chapterwise
}

export const SolutionContent = ({ solutionText, isVisible }: SolutionContentProps) => {

  if (!isVisible) return null;

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
      <div className={styles.header}>
        <div className={styles.title}>Detailed Solution</div>
      </div>

      {/* Parsed Solution text with images handled properly */}
      <div className={styles.body}>
        {solutionText ? parse(solutionText, parserOptions) : null}
      </div>

    </div>
  );
};