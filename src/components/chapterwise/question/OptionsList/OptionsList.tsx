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
  selectedOptionId?: string | null; // Currently selected by user
  onOptionSelect?: (id: string) => void; // Handler when user clicks
  isSubmitted?: boolean; // Has the user clicked "Check Answer"?
  correctAnswer?: string; // Needed for validation visualization
}

export const OptionsList = ({ 
  options, 
  selectedOptionId, 
  onOptionSelect, 
  isSubmitted = false,
  correctAnswer 
}: OptionsListProps) => {

  const handleSelect = (id: string) => {
    // Only allow selection if not yet submitted
    if (!isSubmitted && onOptionSelect) {
      onOptionSelect(id);
    }
  };

  return (
    <div className={styles.grid}>
      {options.map((opt) => {
        const isSelected = opt.id === selectedOptionId;
        const isCorrect = opt.id === correctAnswer;
        
        // --- DYNAMIC CLASS LOGIC ---
        let cardClass = styles.optionCard;

        if (isSubmitted) {
          // POST-SUBMISSION STATES
          if (isCorrect) {
            cardClass += ` ${styles.correct}`; // Green (Correct Answer)
          } else if (isSelected && !isCorrect) {
            cardClass += ` ${styles.wrong}`; // Red (User's Wrong Choice)
          } else if (isSelected && isCorrect) {
            cardClass += ` ${styles.correct}`; // User selected Correct
          } else {
            cardClass += ` ${styles.disabled}`; // Other options faded
          }
        } else {
          // PRE-SUBMISSION STATES (Practice Mode)
          if (isSelected) {
            cardClass += ` ${styles.selected}`; // Blue/Active Highlight
          }
        }

        return (
          <div 
            key={opt.id} 
            className={cardClass}
            onClick={() => handleSelect(opt.id)}
          >
            
            {/* Validation Badge (Only show after submission) */}
            {isSubmitted && isCorrect && (
              <div className={styles.correctBadge}>
                Correct 
                <span className={styles.tickCircle}>
                  <FiCheck size={10} strokeWidth={4} />
                </span>
              </div>
            )}

            {/* Letter Circle */}
            <div className={styles.labelCircle}>
              {opt.id}
            </div>

            {/* Content */}
            <div className={styles.contentWrapper}>
              <div className={styles.text}>{opt.text}</div>
            </div>

            {/* Labels */}
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