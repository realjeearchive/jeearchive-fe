"use client";

import { useState } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import styles from "./SectionInstructionsBox.module.css";

interface Props {
  title: string;
  maxMarks: number;
  questionCount: number;
}

export function SectionInstructionsBox({
  title,
  maxMarks,
  questionCount,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(v => !v)}
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
              This section contains <strong>TWENTY ({questionCount})</strong>{" "}
              questions.
            </li>

            <li>
              Each question has <strong>FOUR</strong> options (A), (B), (C) and
              (D). <strong>ONLY ONE</strong> of these four options is the correct
              answer.
            </li>

            <li>
              For each question, choose the option corresponding to the correct
              answer.
            </li>

            <li>
              Answer to each question will be evaluated{" "}
              <u>according to the following marking scheme</u>:
              <ul className={styles.subList}>
                <li>
                  <em>Full Marks</em> : +4 if <strong>ONLY</strong> the correct
                  option is chosen
                </li>
                <li>
                  <em>Zero Marks</em> : 0 if none of the options is chosen (i.e.
                  the question is unanswered)
                </li>
                <li>
                  <em>Negative Marks</em> : -1 in all other cases.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
