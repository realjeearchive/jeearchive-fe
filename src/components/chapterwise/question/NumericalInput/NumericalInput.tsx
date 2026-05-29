"use client";

import React, { useEffect } from "react";
import styles from "./NumericalInput.module.css";
import { FiDelete } from "react-icons/fi";

interface NumericalInputProps {
  value: string;
  onChange: (val: string) => void;
  isSubmitted?: boolean;
  correctAnswer?: string;
}

export const NumericalInput = ({
  value = "",
  onChange,
  isSubmitted = false,
  correctAnswer,
}: NumericalInputProps) => {
  // Handle on-screen numpad clicks
  const handlePadClick = (key: string) => {
    if (isSubmitted) return;

    if (key === "CLEAR") {
      onChange("");
      return;
    }

    if (key === "BACKSPACE") {
      onChange(value.slice(0, -1));
      return;
    }

    if (key === "+/-") {
      if (value.startsWith("-")) {
        onChange(value.substring(1));
      } else {
        onChange("-" + value);
      }
      return;
    }

    if (key === ".") {
      if (!value.includes(".")) {
        onChange(value + ".");
      }
      return;
    }

    // Default digit append
    onChange(value + key);
  };

  // Allow physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return;

      if (e.key >= "0" && e.key <= "9") handlePadClick(e.key);
      if (e.key === ".") handlePadClick(".");
      if (e.key === "-" || e.key === "+") handlePadClick("+/-");
      if (e.key === "Backspace") handlePadClick("BACKSPACE");
      if (e.key === "Delete" || e.key === "Escape") handlePadClick("CLEAR");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, isSubmitted]);

  // Determine styles if submitted
  const isCorrect =
    isSubmitted && parseFloat(value) === parseFloat(correctAnswer || "");
  const inputClass = isSubmitted
    ? isCorrect
      ? `${styles.inputBox} ${styles.correct}`
      : `${styles.inputBox} ${styles.wrong}`
    : styles.inputBox;

  const numpadButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "+/-"];

  return (
    <div className={styles.container} role="group" aria-label="Numerical answer input">
      <div className={styles.inputWrapper}>
        <label htmlFor="numerical-answer-input" className={styles.inputLabel}>
          Enter Answer:
        </label>
        <input
          id="numerical-answer-input"
          type="text"
          value={value}
          readOnly
          placeholder="Use Numpad"
          className={inputClass}
          aria-label="Numerical answer value"
        />
      </div>

      {isSubmitted && !isCorrect && correctAnswer && (
        <div className={styles.correctAnswerBox} role="alert">
          Correct Answer: <strong>{correctAnswer}</strong>
        </div>
      )}

      <div
        className={`${styles.numpad} ${isSubmitted ? styles.disabled : ""}`}
        role="group"
        aria-label="Numerical keypad"
      >
        {numpadButtons.map((btn) => (
          <button
            key={btn}
            className={styles.numBtn}
            onClick={() => handlePadClick(btn)}
            disabled={isSubmitted}
            aria-label={btn === "+/-" ? "Toggle negative" : btn}
          >
            {btn}
          </button>
        ))}

        <button
          className={`${styles.numBtn} ${styles.actionBtn} ${styles.backspaceBtn}`}
          onClick={() => handlePadClick("BACKSPACE")}
          disabled={isSubmitted}
          aria-label="Backspace"
        >
          <FiDelete size={20} aria-hidden="true" />
        </button>

        <button
          className={`${styles.numBtn} ${styles.actionBtn} ${styles.clearBtn}`}
          onClick={() => handlePadClick("CLEAR")}
          disabled={isSubmitted}
          aria-label="Clear answer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};