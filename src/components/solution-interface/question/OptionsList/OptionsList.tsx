import React from "react";
import styles from "./OptionsList.module.css";
import { FiCheck } from "react-icons/fi";

interface Option {
  id: string; 
  text: string;
  percentage?: number; 
}

interface OptionsListProps {
  options: Option[];
  correctAnswer: string; 
  userAnswer?: string | null; 
}

export const OptionsList = ({ options, correctAnswer, userAnswer }: OptionsListProps) => {
  return (
    <div className={styles.grid}>
      {options.map((opt) => {
        const isCorrect = opt.id === correctAnswer;
        const isUserSelected = opt.id === userAnswer;
        
        let cardClass = styles.optionCard;
        if (isCorrect) cardClass += ` ${styles.correct}`;
        else if (isUserSelected && !isCorrect) cardClass += ` ${styles.wrong}`;

        return (
          <div key={opt.id} className={cardClass}>
            
            {/* Correct Badge (Floating Pill) */}
            {isCorrect && (
              <div className={styles.correctBadge}>
                Correct <FiCheck size={12} strokeWidth={4} />
              </div>
            )}

            {/* Letter Circle */}
            <div className={styles.labelCircle}>
              {opt.id}
            </div>

            {/* Content */}
            <div className={styles.contentWrapper}>
              <div className={styles.text}>{opt.text}</div>

              {/* Stats & User Marker Row */}
              <div className={styles.bottomRow}>
                {/* % Stats (Left) */}
                <span className={styles.statsText}>
                  {opt.percentage ? `${opt.percentage}% marked this` : ""}
                </span>

                {/* "You marked this" (Right) */}
                {isUserSelected && (
                  <span className={`${styles.userMarkedLabel} ${isCorrect ? styles.textGreen : styles.textRed}`}>
                    You marked this
                  </span>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};