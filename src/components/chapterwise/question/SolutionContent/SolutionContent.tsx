"use client";

import React from "react";
import styles from "./SolutionContent.module.css";
import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import Latex from "@/components/testPlayer/Latex/Latex";

interface SolutionContentProps {
  solutionText: string;
  isVisible: boolean;
}

export const SolutionContent = ({ solutionText, isVisible }: SolutionContentProps) => {
  if (!isVisible) return null;

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
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...element.attribs}
              className={styles.parsedImage}
              alt={element.attribs.alt || "Solution diagram or figure"}
            />
          );
        }
      }
    },
  };

  return (
    <section className={styles.container} id="detailed-solution-section" aria-label="Detailed solution">
      <div className={styles.header}>
        <h2 className={styles.title}>Detailed Solution</h2>
      </div>

      <div className={styles.body}>
        {solutionText ? parse(solutionText, parserOptions) : null}
      </div>
    </section>
  );
};