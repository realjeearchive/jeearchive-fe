"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/playertypes";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";
import Latex from "@/components/testPlayer/Latex/Latex";

interface Props {
  question: TestQuestion;
  questionState: QuestionState;
  onSelectOption: (value: string) => void;
}

export function QuestionBlock({
  question,
  questionState,
  onSelectOption,
}: Props) {
  const { fontSize } = useTestPlayerAccessibility();
  const isSelected = (optId: string) => questionState.selectedOptionIds.includes(optId);

  // --- CONTENT RENDERER (For Main Question) ---
  const renderContent = (text: string, images: string[]) => {
    if (!text) return null;

    // Regex to split by ![image_N](N)
    const regex = /!\[image_\d+\]\((\d+)\)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      // The split operation puts the capture group (the index) at odd positions
      if (i % 2 === 1) {
        const imgIndex = parseInt(part, 10);
        
        // Safety Check: Does the image exist at this index?
        if (images && images[imgIndex]) {
          return (
            <div key={i} className={styles.inlineImageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={images[imgIndex]} 
                alt={`Figure ${imgIndex}`} 
                className={styles.questionImage} 
              />
            </div>
          );
        }
        return null; 
      }

      // Render text
      return <Latex key={i}>{part}</Latex>;
    });
  };

  // --- OPTION TEXT CLEANER ---
  // Removes ![image_0](0) from option text so we don't show the raw code
  const cleanOptionText = (text: string) => {
    if (!text) return "";
    return text.replace(/!\[image_\d+\]\(\d+\)/g, "").trim();
  };

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {/* 1. QUESTION HEADER */}
      <div className={styles.questionHeader}>
        <div className={styles.questionText}>
          {renderContent(question.contentText, question.images)}
        </div>
      </div>

      {/* 2. OPTIONS */}
      {question.kind === "single" && (
        <div className={styles.optionsList}>
          {question.options.map((opt) => {
            const checked = isSelected(opt.id);
            // Clean the text to remove image placeholders
            const visibleText = cleanOptionText(opt.text);

            return (
              <label key={opt.id} className={`${styles.optionRow} ${checked ? styles.selected : ""}`}>
                <div className={styles.radioWrapper}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={checked}
                    onChange={() => onSelectOption(opt.id)}
                  />
                </div>

                <div className={styles.optionContent}>
                  {/* Only render text if there is something left after cleaning */}
                  {visibleText && (
                    <span className={styles.optionText}>
                      <Latex>{visibleText}</Latex>
                    </span>
                  )}
                  
                  {/* Render the Image explicitly */}
                  {opt.imageUrl && (
                     // eslint-disable-next-line @next/next/no-img-element
                    <img src={opt.imageUrl} alt="Option Figure" className={styles.optImage} />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* 3. NUMERICAL */}
      {question.kind === "numerical" && (
        <div className={styles.numericalWrapper}>
          <label className={styles.numericalLabel}>Enter answer:</label>
          <input
            type="text"
            className={styles.numericalInput}
            value={questionState.numericAnswer || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (/^-?\d*\.?\d*$/.test(val)) onSelectOption(val);
            }}
          />
        </div>
      )}
    </div>
  );
}