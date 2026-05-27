"use client";

import { useState } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import styles from "./SectionInstructionsBox.module.css";
import { numberToWords } from "@/utils/numberToWords";

interface Props {
  title: string;
  maxMarks: number;
  questionCount: number;
  sectionType: "single" | "numerical" | "multi" | "comprehension";
  positiveMark: number;
  negativeMark: number;
}

export function SectionInstructionsBox({
  title,
  maxMarks,
  questionCount,
  sectionType,
  positiveMark,
  negativeMark,
}: Props) {
  const [open, setOpen] = useState(false);

  const countWord =
    typeof numberToWords === "function"
      ? numberToWords(questionCount)
      : questionCount;
  const negativeMarkDisplay = negativeMark > 0 ? `-${negativeMark}` : "0";

  const renderSpecificInstructions = () => {
    switch (sectionType) {
      case "numerical":
        return (
          <>
            <li>
              The answer to each question is a <strong>NUMERICAL VALUE</strong>.
            </li>
            <li>
              For each question, enter the correct numerical value (in integer or
              decimal notation).
            </li>
          </>
        );
      case "multi":
        return (
          <>
            <li>
              Each question has <strong>FOUR</strong> options (A), (B), (C) and
              (D). <strong>ONE OR MORE THAN ONE</strong> of these four options is
              the correct answer.
            </li>
            <li>
              For each question, choose ALL the options corresponding to the
              correct answer.
            </li>
          </>
        );
      case "comprehension":
        return (
          <>
            <li>
              This section contains questions based on a{" "}
              <strong>PARAGRAPH</strong>.
            </li>
            <li>Choose the correct option corresponding to the question.</li>
          </>
        );
      case "single":
      default:
        return (
          <>
            <li>
              Each question has <strong>FOUR</strong> options (A), (B), (C) and
              (D). <strong>ONLY ONE</strong> of these four options is the correct
              answer.
            </li>
            <li>
              For each question, choose the option corresponding to the correct
              answer.
            </li>
          </>
        );
    }
  };

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="section-instructions-content"
      >
        <span>
          {title} (Maximum Marks: {maxMarks})
        </span>

        <span className={styles.icon} aria-hidden="true">
          {open ? (
            <MdOutlineKeyboardArrowUp size={22} />
          ) : (
            <MdOutlineKeyboardArrowDown size={22} />
          )}
        </span>
      </button>

      <div
        id="section-instructions-content"
        className={`${styles.contentWrapper} ${
          open ? styles.open : styles.closed
        }`}
        role="region"
        aria-label={`Instructions for ${title}`}
      >
        <div className={styles.content}>
          <ul className={styles.mainList}>
            <li>
              This section contains{" "}
              <strong>
                {countWord} ({questionCount})
              </strong>{" "}
              questions.
            </li>

            {renderSpecificInstructions()}

            <li>
              Answer to each question will be evaluated{" "}
              <u>according to the following marking scheme</u>:
              <ul className={styles.subList}>
                <li>
                  <em>Full Marks</em> : +{positiveMark} if{" "}
                  <strong>
                    {sectionType === "multi"
                      ? "ALL correct options"
                      : "CORRECT answer"}
                  </strong>{" "}
                  is/are chosen.
                </li>
                <li>
                  <em>Zero Marks</em> : 0 if the question is unanswered.
                </li>
                <li>
                  <em>Negative Marks</em> : {negativeMarkDisplay} in all other
                  cases.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}