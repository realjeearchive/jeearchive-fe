"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/playertypes";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";
import Latex from "@/components/testPlayer/Latex/Latex";
import parse, { DOMNode } from 'html-react-parser';

// --- RESTORED IMPORT ---
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
  const isSelected = (optId: string) => questionState.selectedOptionIds.includes(optId);

  // --- CONTENT RENDERER (Preserving your HTML parser update) ---
  const renderContent = (text: string, images: string[]) => {
    if (!text) return null;

    const regex = /!\[image_\d+\]\((\d+)\)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      // Image Handling
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

      // Text Handling with HTML Parsing + Latex
      const options = {
        replace: (domNode: DOMNode) => {
          if (domNode.type === 'text') {
             return <Latex>{domNode.data}</Latex>;
          }
        }
      };

      return <span key={i}>{parse(part, options)}</span>;
    });
  };

  const cleanOptionText = (text: string) => {
    if (!text) return "";
    return text.replace(/!\[image_\d+\]\(\d+\)/g, "").trim();
  };

  const numericalInputId = `numerical-input-${question.id}`;

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {/* 1. QUESTION HEADER */}
      <div className={styles.questionHeader}>
        <div className={styles.questionText}>
          {renderContent(question.contentText, question.images)}
        </div>
      </div>

      {/* 2. OPTIONS (Multiple Choice) */}
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
                    id={`radio-${opt.id}`}
                    aria-label={visibleText || "Option"} 
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

      {/* 3. NUMERICAL (RESTORED Virtual Numpad) */}
      {question.kind === "numerical" && (
        <div className={styles.numericalWrapper}>
          <div className={styles.mainAnswerArea}>
            <label htmlFor={numericalInputId} className={styles.numericalLabel}>
              Enter Answer:
            </label>
            
            {/* Read-Only Input (Security for CBT) */}
            <input
              id={numericalInputId}
              type="text"
              className={styles.numericalInput}
              value={questionState.numericAnswer || ""}
              readOnly 
              placeholder="Use Numpad below"
            />
          </div>
          
          {/* Virtual Numpad Component */}
          <VirtualNumpad 
            initialValue={questionState.numericAnswer || ""}
            onChange={(val) => onSelectOption(val)}
          />
          
          <p style={{fontSize: '0.85em', color: '#666', marginTop: '8px'}}>
            * Use the on-screen keypad to enter your answer.
          </p>
        </div>
      )}
    </div>
  );
}