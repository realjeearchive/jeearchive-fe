"use client";

import React from "react";
import styles from "./QuestionText.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import Latex from "@/components/testPlayer/Latex/Latex"; // <-- Update path if needed

interface QuestionTextProps {
  content: string; 
  hasImage?: boolean;
  imageUrl?: string;
}

export const QuestionText = ({ content, hasImage, imageUrl }: QuestionTextProps) => {

  // Parser options identical to your Test Player
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      // 1. Parse Text for LaTeX
      if (domNode.type === 'text') {
         if (domNode.data && domNode.data.trim() !== '') {
             return <Latex>{domNode.data}</Latex>;
         }
      }
      
      // 2. Intercept Images to apply our dark-mode/sizing CSS
      if (domNode.type === 'tag') {
        const element = domNode as Element;
        if (element.name === 'img') {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...element.attribs}
              className={styles.parsedImage} 
              alt={element.attribs.alt || "Question Figure"}
            />
          );
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Safely parsed HTML with KaTeX rendering */}
      <div className={styles.htmlContent}>
        {content ? parse(content, parserOptions) : null}
      </div>
      
      {/* Fallback for explicit images passed via props */}
      {hasImage && imageUrl && (
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt="Question Diagram" className={styles.parsedImage} />
        </div>
      )}

    </div>
  );
};