"use client";

import styles from "./QuestionBlock.module.css";
import type { TestQuestion } from "@/features/tests/types";
import type { QuestionState } from "@/features/tests/testEngineStore";

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
  return (
    <>
      {/* QUESTION TEXT */}
      <div className={styles.questionText}>
        {question.contentText}
      </div>

      {/* OPTIONS */}
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
    </>
  );
}
