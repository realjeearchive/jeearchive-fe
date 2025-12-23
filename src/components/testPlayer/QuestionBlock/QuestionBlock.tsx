"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/testEngineStore";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";


interface Props {
  question: TestQuestion;
  questionState: QuestionState;
  onSelectOption: (optionId: string) => void;
}

export function QuestionBlock({
  question,
  questionState,
  onSelectOption,
}: Props) {
  const { fontSize } = useTestPlayerAccessibility();

  return (
    
    
      <div
        className={styles.questionWrapper}
        data-font-size={fontSize}
      >
        <div className={styles.questionText}>
          {question.contentText}
        </div>

        <div className={styles.optionsList}>
          {question.options.map((opt) => {
            const isSelected =
              questionState.selectedOptionIds.includes(opt.id);

            return (
              <label
                key={opt.id}
                className={`${styles.optionRow} ${
                  isSelected ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={isSelected}
                  onChange={() => onSelectOption(opt.id)}
                />
                <span className={styles.optionText}>{opt.text}</span>
              </label>
            );
          })}
        </div>
      </div>

    
  );
}
