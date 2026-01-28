"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/playertypes";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";
import Latex from "@/components/testPlayer/Latex/Latex";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser'; // Import HTMLReactParserOptions if available, or just infer type
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

  // --- 1. SHARED PARSER OPTIONS ---
  // We define this once so both the Question Text and Options are rendered identically
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      // Handle Text Nodes -> Wrap in Latex Component to render math like $$x^2$$
      if (domNode.type === 'text') {
         // Only wrap if there is actual text content to avoid empty Latex components
         if (domNode.data && domNode.data.trim() !== '') {
             return <Latex>{domNode.data}</Latex>;
         }
      }

      // Handle Images -> Apply CSS Module Class
      if (domNode.type === 'tag' && domNode.name === 'img') {
        const element = domNode as Element; 
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...element.attribs}
            className={styles.questionImage} 
            alt={element.attribs.alt || "Figure"}
          />
        );
      }
    }
  };

  // --- CONTENT RENDERER ---
  const renderContent = (htmlContent: string) => {
    if (!htmlContent) return null;
    return <div className={styles.htmlContent}>{parse(htmlContent, parserOptions)}</div>;
  };

  // --- OPTION RENDERER (FIXED) ---
  const renderOptionText = (text: string) => {
      if (!text) return null;
      // FIXED: Now we parse the HTML in options just like we do for the question
      // This will handle <p>, <sub>, and embedded Latex $$...$$ correctly.
      return parse(text, parserOptions); 
  };

  const numericalInputId = `numerical-input-${question.id}`;

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {/* 1. QUESTION HEADER */}
      <div className={styles.questionHeader}>
        <div className={styles.questionText}>
          {renderContent(question.contentText)}
        </div>
      </div>

      {/* 2. OPTIONS (Multiple Choice) */}
      {question.kind === "single" && (
        <div className={styles.optionsList}>
          {question.options.map((opt) => {
            const checked = isSelected(opt.id);

            return (
              <label key={opt.id} className={`${styles.optionRow} ${checked ? styles.selected : ""}`}>
                <div className={styles.radioWrapper}>
                  <input
                    type="radio"
                    name={question.id}
                    id={`radio-${opt.id}`}
                    aria-label={`Option ${opt.id}`}
                    checked={checked}
                    onChange={() => onSelectOption(opt.id)}
                  />
                </div>

                <div className={styles.optionContent}>
                  {/* Render Option Text with the shared parser */}
                  <span className={styles.optionText}>
                    {renderOptionText(opt.text)}
                  </span>
                  
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

      {/* 3. NUMERICAL INPUT */}
      {question.kind === "numerical" && (
        <div className={styles.numericalWrapper}>
          <div className={styles.mainAnswerArea}>
            <label htmlFor={numericalInputId} className={styles.numericalLabel}>
              Enter Answer:
            </label>
            
            <input
              id={numericalInputId}
              type="text"
              className={styles.numericalInput}
              value={questionState.numericAnswer || ""}
              readOnly 
              placeholder="Use Numpad below"
            />
          </div>
          
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