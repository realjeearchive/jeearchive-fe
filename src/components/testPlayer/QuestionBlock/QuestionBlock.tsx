"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/playertypes";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";
import Latex from "@/components/testPlayer/Latex/Latex";
import VirtualNumpad from "../VirtualNumpad/VirtualNumpad";

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
  
  if (!questionState) return null;

  const isSelected = (optId: string) => 
    questionState.selectedOptionIds ? questionState.selectedOptionIds.includes(optId) : false;

  // --- CONTENT RENDERER ---
  const renderContent = (text: string, images: string[]) => {
    if (!text) return null;
    const regex = /!\[image_\d+\]\((\d+)\)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const imgIndex = parseInt(part, 10);
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
      return <Latex key={i}>{part}</Latex>;
    });
  };

  const cleanOptionText = (text: string) => {
    if (!text) return "";
    return text.replace(/!\[image_\d+\]\(\d+\)/g, "").trim();
  };

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {/* HEADER */}
      <div className={styles.questionHeader}>
        <div className={styles.questionText}>
          {renderContent(question.contentText, question.images)}
        </div>
      </div>

      {/* OPTIONS (Single Correct) */}
      {question.kind === "single" && (
        <div className={styles.optionsList}>
          {question.options.map((opt) => {
            const checked = isSelected(opt.id);
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
                  {visibleText && (
                    <span className={styles.optionText}>
                      <Latex>{visibleText}</Latex>
                    </span>
                  )}
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

      {/* NUMERICAL (Numpad) */}
      {question.kind === "numerical" && (
        <div className={styles.numericalWrapper}>
          <div className={styles.mainAnswerArea}>
            <label className={styles.numericalLabel}>Enter Answer:</label>
            {/* Main Input Area: Updates when Numpad types, stays when Numpad clears */}
            <input
              type="text"
              className={styles.numericalInput}
              value={questionState.numericAnswer || ""}
              readOnly 
              placeholder="Use Numpad below"
            />
          </div>
          
          {/* Small On-Screen Numpad */}
          <VirtualNumpad 
            initialValue={questionState.numericAnswer || ""}
            onChange={(val) => onSelectOption(val)}
          />
        </div>
      )}
    </div>
  );
}