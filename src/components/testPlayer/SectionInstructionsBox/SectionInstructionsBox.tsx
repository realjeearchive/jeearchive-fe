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
  sectionType: "single" | "numerical";
  positiveMark: number; // New Prop
  negativeMark: number; // New Prop
}

export function SectionInstructionsBox({
  title,
  maxMarks,
  questionCount,
  sectionType,
  positiveMark,
  negativeMark,
}: Props) {
  const [open, setOpen] = useState(true);
  const countWord = numberToWords(questionCount);

  // Format negative mark display (e.g. if 1 -> "-1", if 0 -> "0")
  const negativeMarkDisplay = negativeMark > 0 ? `-${negativeMark}` : "0";

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          {title} (Maximum Marks: {maxMarks})
        </span>

        <span className={styles.icon}>
          {open ? (
            <MdOutlineKeyboardArrowUp size={22} />
          ) : (
            <MdOutlineKeyboardArrowDown size={22} />
          )}
        </span>
      </button>

      <div
        className={`${styles.contentWrapper} ${
          open ? styles.open : styles.closed
        }`}
      >
        <div className={styles.content}>
          <ul className={styles.mainList}>
            <li>
              This section contains <strong>{countWord} ({questionCount})</strong> questions.
            </li>

            {sectionType === "single" ? (
              <>
                <li>
                  Each question has <strong>FOUR</strong> options (A), (B), (C) and (D).{" "}
                  <strong>ONLY ONE</strong> of these four options is the correct answer.
                </li>
                <li>
                  For each question, choose the option corresponding to the correct answer.
                </li>
              </>
            ) : (
              <>
                <li>
                  The answer to each question is a <strong>NUMERICAL VALUE</strong>.
                </li>
                <li>
                  For each question, enter the correct numerical value (in integer or decimal notation).
                </li>
              </>
            )}

            <li>
              Answer to each question will be evaluated{" "}
              <u>according to the following marking scheme</u>:
              <ul className={styles.subList}>
                <li>
                  <em>Full Marks</em> : +{positiveMark} if <strong>ONLY</strong> the correct{" "}
                  {sectionType === "single" ? "option is chosen" : "answer is entered"}
                </li>
                <li>
                  <em>Zero Marks</em> : 0 if {sectionType === "single" ? "none of the options is chosen" : "the question is unanswered"}
                </li>
                <li>
                  <em>Negative Marks</em> : {negativeMarkDisplay} in all other cases.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}