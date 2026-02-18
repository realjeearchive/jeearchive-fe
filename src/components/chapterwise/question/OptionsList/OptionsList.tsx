"use client";

import React from "react";
import styles from "./OptionsList.module.css";
import { FiCheck, FiX } from "react-icons/fi";

export interface Option {
  id: string;
  text: string;
  percentage?: number;
}

interface OptionsListProps {
  options: Option[];
  selectedOptionId?: string | null;
  onOptionSelect?: (id: string) => void;
  isSubmitted?: boolean;
  correctAnswer?: string;
}

export const OptionsList = ({ 
  options, 
  selectedOptionId, 
  onOptionSelect, 
  isSubmitted = false,
  correctAnswer 
}: OptionsListProps) => {

  const handleSelect = (id: string) => {
    if (!isSubmitted && onOptionSelect) {
      onOptionSelect(id);
    }
  };

  return (
    <div className={styles.grid}>
      {options.map((opt) => {
        const isSelected = opt.id === selectedOptionId;
        const isCorrect = opt.id === correctAnswer;
        
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
          >
            {isSubmitted && isCorrect && (
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
              <div className={styles.text}>{opt.text}</div>
            </div>

            {isSubmitted && isSelected && (
              <span className={`${styles.userMarkedLabel} ${isCorrect ? styles.textGreen : styles.textRed}`}>
                {isCorrect ? "You got it right!" : "You marked this"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};