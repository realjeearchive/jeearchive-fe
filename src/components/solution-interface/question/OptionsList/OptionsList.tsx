"use client";

import React from "react";
import styles from "./OptionsList.module.css";
import { FiCheck } from "react-icons/fi";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
import Latex from "@/components/testPlayer/Latex/Latex";

interface Option {
  id: string; 
  text: string;
  percentage?: number; 
}

interface OptionsListProps {
  options: Option[];
  correctAnswer: string[]; // 🔥 FIXED: Accepts Array
  userAnswer?: string[] | null; // 🔥 FIXED: Accepts Array
}

export const OptionsList = ({ options, correctAnswer, userAnswer }: OptionsListProps) => {

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
              alt={element.attribs.alt || "Option Figure"}
            />
          );
        }
      }
    }
  };

  return (
    <div className={styles.grid}>
      {options.map((opt) => {
        // 🔥 FIXED: Check against arrays instead of exact string matches
        const isCorrect = correctAnswer.includes(opt.id);
        const isUserSelected = userAnswer ? userAnswer.includes(opt.id) : false;
        
        let cardClass = styles.optionCard;
        if (isCorrect) cardClass += ` ${styles.correct}`;
        else if (isUserSelected && !isCorrect) cardClass += ` ${styles.wrong}`;

        return (
          <div key={opt.id} className={cardClass}>
            {isCorrect && (
              <div className={styles.correctBadge}>
                Correct 
                <span className={styles.tickCircle}>
                  <FiCheck size={10} strokeWidth={4} />
                </span>
              </div>
            )}

            <div className={styles.labelCircle}>
              {opt.id}
            </div>

            <div className={styles.contentWrapper}>
              <div className={styles.text}>
                {opt.text ? parse(opt.text, parserOptions) : null}
              </div>

              {opt.percentage && (
                <span className={styles.statsText}>
                  {opt.percentage}% marked this
                </span>
              )}
            </div>

            {isUserSelected && (
              <span className={`${styles.userMarkedLabel} ${isCorrect ? styles.textGreen : styles.textRed}`}>
                You marked this
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};