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

  // 🔥 THE FIX: Safely preprocess the HTML before the parser touches it
  // 🔥 THE FIX: Safely preprocess the HTML before the parser touches it
  // 🔥 THE FIX: Safely preprocess the HTML before the parser touches it
  const preprocessHtml = (html: string) => {
    if (!html) return "";

    // Clean rogue HTML tags INSIDE math blocks safely.
    // This regex strictly targets tags starting with letters (like <p>, <br>) so it NEVER hurts math like < or >.
    const stripTags = (str: string) => str.replace(/<\/?\s*[a-zA-Z][^>]*>/g, '');

    // Uses [\s\S]*? to safely match across multiple lines without causing the ES2018 compiler error
    const processed = html
      .replace(/\$\$([\s\S]*?)\$\$/g, (match) => stripTags(match))
      .replace(/\\\[([\s\S]*?)\\\]/g, (match) => stripTags(match))
      .replace(/\\\(([\s\S]*?)\\\)/g, (match) => stripTags(match));

    return processed;
  };

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
              className={styles.questionImage} 
              alt={element.attribs.alt || "Question related image"}
            />
          );
        }
      }
    }
  };

  const renderContent = (htmlContent: string) => {
    if (!htmlContent) return null;
    const safeHtml = preprocessHtml(htmlContent);
    return <div className={styles.htmlContent}>{parse(safeHtml, parserOptions)}</div>;
  };

  const renderOptionText = (text: string) => {
      if (!text) return null;
      const safeHtml = preprocessHtml(text);
      return parse(safeHtml, parserOptions); 
  };

  const numericalInputId = `numerical-input-${question.id}`;
  const isMulti = question.kind === "multi";
  const inputType = isMulti ? "checkbox" : "radio";
  const showOptions = question.kind !== "numerical";

  return (
    <div className={styles.questionWrapper} data-font-size={fontSize}>
      
      {question.comprehensionContent && (
        <div className={styles.comprehensionBox}>
           <div className={styles.sectionLabel}>Passage</div>
           <div className={styles.comprehensionText}>
             {renderContent(question.comprehensionContent)}
           </div>
        </div>
      )}

      <div className={styles.questionHeader}>
        {question.images && question.images.length > 0 && (
          <div className={styles.imageGrid}>
            {question.images.map((imgUrl, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={imgUrl} alt={`Question diagram or figure ${idx + 1}`} className={styles.questionImage} />
            ))}
          </div>
        )}
        <div className={styles.questionText}>
          {renderContent(question.contentText)}
        </div>
      </div>

      {showOptions && (
        <div className={styles.optionsList}>
          {isMulti && <p className={styles.multiHint} role="note">* One or more options may be correct</p>}
          
          {question.options.map((opt) => {
            const checked = isSelected(opt.id);

            return (
              <label key={opt.id} className={`${styles.optionRow} ${checked ? styles.selected : ""}`}>
                <div className={styles.inputWrapper}>
                  <input
                    type={inputType}
                    name={question.id}
                    id={`${inputType}-${opt.id}`}
                    aria-label={`Select option ${opt.id}`}
                    checked={checked}
                    onChange={() => onSelectOption(opt.id)}
                    className={styles.optionInput} 
                  />
                </div>

                <div className={styles.optionContent}>
                  <div className={styles.optionText}>{renderOptionText(opt.text)}</div>
                  
                  {opt.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={opt.imageUrl} alt={`Option ${opt.id} related image`} className={styles.optImage} />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

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