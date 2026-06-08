"use client";

import React, { useState } from "react";
import styles from "./SolutionContent.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import Latex from "@/components/testPlayer/Latex/Latex";

interface SolutionContentProps {
  solutionText: string;
  videoUrl?: string | null;
}

export const SolutionContent = ({
  solutionText,
  videoUrl,
}: SolutionContentProps) => {
  const [showVideo, setShowVideo] = useState(false);

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
          const { class: _className, src, alt, ...restAttribs } = element.attribs;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || "Solution diagram or figure"}
              className={`${styles.parsedImage} ${_className || ""}`}
              {...restAttribs}
            />
          );
        }
      }
    },
  };

  return (
    <section
      className={styles.container}
      id="detailed-solution-section"
      aria-label="Detailed solution"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Detailed Solution</h2>

        {videoUrl && (
          <button
            className={styles.videoBadge}
            onClick={() => setShowVideo(!showVideo)}
            aria-expanded={showVideo}
            aria-label={showVideo ? "Hide solution video" : "Watch solution video"}
          >
            {showVideo ? "Hide Video" : "Watch Video"}
          </button>
        )}
      </div>

      <div className={styles.body}>
        {solutionText ? parse(solutionText, parserOptions) : null}
      </div>

      {showVideo && videoUrl && (
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl}
            title="Solution video explanation"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
};