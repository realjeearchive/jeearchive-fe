"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/playertypes";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";
import Latex from "@/components/testPlayer/Latex/Latex";
import parse, { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser';
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


// Update the parserOptions to handle table tags correctly if they exist in htmlContent
const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (domNode.type === 'text') {
       if (domNode.data && domNode.data.trim() !== '') {
           return <Latex>{domNode.data}</Latex>;
       }
    }
    
    // Ensure tables from backend are allowed through the parser
    if (domNode.type === 'tag') {
      const element = domNode as Element;
      
      if (element.name === 'img') {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...element.attribs}
            className={styles.questionImage} 
            alt={element.attribs.alt || "Figure"}
          />
        );
      }
      
      // If backend sends specific tags for List-I / List-II, you can intercept them here
      // For now, we let standard HTML (table, tr, td) pass to be styled by CSS
    }
  }
};

  const renderContent = (htmlContent: string) => {
    if (!htmlContent) return null;
    return <div className={styles.htmlContent}>{parse(htmlContent, parserOptions)}</div>;
  };

  const renderOptionText = (text: string) => {
      if (!text) return null;
      return parse(text, parserOptions); 
  };

  const numericalInputId = `numerical-input-${question.id}`;
  
  // Logic: Checkbox for Multi-Correct, Radio for Single/Comprehension
  const isMulti = question.kind === "multi";
  const inputType = isMulti ? "checkbox" : "radio";
  const showOptions = question.kind !== "numerical";

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {/* 1. COMPREHENSION PASSAGE */}
      {question.comprehensionContent && (
        <div className={styles.comprehensionBox}>
           <div className={styles.sectionLabel}>Passage</div>
           <div className={styles.comprehensionText}>
             {renderContent(question.comprehensionContent)}
           </div>
        </div>
      )}

      {/* 2. QUESTION HEADER */}
      <div className={styles.questionHeader}>
        {/* Images First */}
        {question.images && question.images.length > 0 && (
          <div className={styles.imageGrid}>
            {question.images.map((imgUrl, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={imgUrl} alt={`Question Figure ${idx + 1}`} className={styles.questionImage} />
            ))}
          </div>
        )}

        {/* Content Text */}
        <div className={styles.questionText}>
          {renderContent(question.contentText)}
        </div>
      </div>

      {/* 3. OPTIONS */}
      {showOptions && (
        <div className={styles.optionsList}>
          {isMulti && <p className={styles.multiHint}>* One or more options may be correct</p>}
          
          {question.options.map((opt) => {
            const checked = isSelected(opt.id);

            return (
              <label key={opt.id} className={`${styles.optionRow} ${checked ? styles.selected : ""}`}>
                <div className={styles.inputWrapper}>
                  <input
                    type={inputType}
                    name={question.id}
                    id={`${inputType}-${opt.id}`}
                    aria-label={`Option ${opt.id}`}
                    checked={checked}
                    onChange={() => onSelectOption(opt.id)}
                    className={styles.optionInput} // Unified class
                  />
                </div>

                <div className={styles.optionContent}>
                  <div className={styles.optionText}>{renderOptionText(opt.text)}</div>
                  
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

      {/* 4. NUMERICAL INPUT */}
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
              placeholder="Use Numpad"
            />
          </div>
          
          <VirtualNumpad 
            initialValue={questionState.numericAnswer || ""}
            onChange={(val) => onSelectOption(val)}
          />
        </div>
      )}
    </div>
  );
}