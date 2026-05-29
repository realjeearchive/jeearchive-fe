"use client";

import React from "react";
import styles from "./QuestionText.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import Latex from "@/components/testPlayer/Latex/Latex";

interface QuestionTextProps {
  content: string;
  hasImage?: boolean;
  imageUrl?: string;
}

export const QuestionText = ({ content, hasImage, imageUrl }: QuestionTextProps) => {
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === "text") {
        if (domNode.data && domNode.data.trim() !== "") {
          return <Latex>{domNode.data}</Latex>;
        }
      }

      if (domNode.type === "tag") {
        const element = domNode as Element;
        if (element.name === "img") {
          // Extract only the attributes we need, rename 'class' to avoid React warning
          const { class: _className, src, alt, ...restAttribs } = element.attribs;
          
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || "Question diagram or figure"}
              className={`${styles.parsedImage} ${_className || ""}`}
              {...restAttribs}
            />
          );
        }
      }
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.htmlContent}>
        {content ? parse(content, parserOptions) : null}
      </div>

      {hasImage && imageUrl && (
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Question diagram"
            className={styles.parsedImage}
          />
        </div>
      )}
    </div>
  );
};