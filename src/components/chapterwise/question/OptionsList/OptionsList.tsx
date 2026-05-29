"use client";

import React from "react";
import styles from "./OptionsList.module.css";
import { FiCheck } from "react-icons/fi";
import parse, { DOMNode, Element, HTMLReactParserOptions } from "html-react-parser";
import Latex from "@/components/testPlayer/Latex/Latex";

export interface Option {
  id: string;
  text: string;
  percentage?: number;
}

interface OptionsListProps {
  options: Option[];
  selectedOptionId?: string | string[] | null;
  onOptionSelect?: (id: string) => void;
  isSubmitted?: boolean;
  correctAnswer?: string | string[];
  isMultiSelect?: boolean;
}

export const OptionsList = ({
  options,
  selectedOptionId,
  onOptionSelect,
  isSubmitted = false,
  correctAnswer,
  isMultiSelect = false,
}: OptionsListProps) => {
  const handleSelect = (id: string) => {
    if (!isSubmitted && onOptionSelect) {
      onOptionSelect(id);
    }
  };

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
              alt={element.attribs.alt || "Option related image"}
            />
          );
        }
      }
    },
  };

  return (
    <fieldset className={styles.grid} aria-label={isMultiSelect ? "Select all correct options" : "Select the correct option"}>
      {options.map((opt) => {
        const isSelected = Array.isArray(selectedOptionId)
          ? selectedOptionId.includes(opt.id)
          : opt.id === selectedOptionId;

        const isCorrect = Array.isArray(correctAnswer)
          ? correctAnswer.includes(opt.id)
          : opt.id === correctAnswer;

        let cardClass = styles.optionCard;

        if (isSubmitted) {
          if (isCorrect) {
            cardClass += ` ${styles.correct}`;
          } else if (isSelected && !isCorrect) {
            cardClass += ` ${styles.wrong}`;
          } else if (isSelected && isCorrect) {
            cardClass += ` ${styles.correct}`;
          } else {
            cardClass += ` ${styles.disabled}`;
          }
        } else {
          if (isSelected) {
            cardClass += ` ${styles.selected}`;
          }
        }

        return (
          <div
            key={opt.id}
            className={cardClass}
            onClick={() => handleSelect(opt.id)}
            role={isMultiSelect ? "checkbox" : "radio"}
            aria-checked={isSelected}
            aria-label={`Option ${opt.id}${isSubmitted && isCorrect ? " - Correct answer" : ""}${isSubmitted && isSelected && !isCorrect ? " - Your answer" : ""}`}
            tabIndex={isSubmitted ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isSubmitted) {
                e.preventDefault();
                handleSelect(opt.id);
              }
            }}
          >
            {isSubmitted && isCorrect && (
              <div className={styles.correctBadge}>
                Correct
                <span className={styles.tickCircle} aria-hidden="true">
                  <FiCheck size={10} strokeWidth={4} />
                </span>
              </div>
            )}

            <div className={styles.labelCircle} aria-hidden="true">
              {opt.id}
            </div>

            <div className={styles.contentWrapper}>
              <div className={styles.text}>
                {opt.text ? parse(opt.text, parserOptions) : null}
              </div>
            </div>

            {isSubmitted && isSelected && (
              <span
                className={`${styles.userMarkedLabel} ${isCorrect ? styles.textGreen : styles.textRed}`}
                role="status"
              >
                {isCorrect ? "You got it right!" : "You marked this"}
              </span>
            )}
          </div>
        );
      })}
    </fieldset>
  );
};