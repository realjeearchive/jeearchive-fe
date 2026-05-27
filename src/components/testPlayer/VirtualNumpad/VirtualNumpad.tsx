"use client";

import { useState, useEffect } from "react";
import styles from "./VirtualNumpad.module.css";
import { FiDelete, FiCheck } from "react-icons/fi";

interface Props {
  initialValue: string;
  onChange: (newValue: string) => void;
}

export default function VirtualNumpad({ initialValue, onChange }: Props) {
  const [localValue, setLocalValue] = useState(initialValue || "");

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handlePress = (key: string) => {
    let nextValue = localValue;

    if (key === "ENTER") {
      setLocalValue("");
      return;
    }

    if (key === "BACKSPACE") {
      nextValue = nextValue.slice(0, -1);
    } else if (key === "CLEAR") {
      nextValue = "";
    } else if (key === ".") {
      if (!nextValue.includes(".")) {
        nextValue += ".";
      }
    } else if (key === "-") {
      if (nextValue.startsWith("-")) {
        nextValue = nextValue.slice(1);
      } else {
        nextValue = "-" + nextValue;
      }
    } else {
      nextValue += key;
    }

    setLocalValue(nextValue);
    onChange(nextValue);
  };

  return (
    <div className={styles.numpadContainer} role="group" aria-label="Numerical input keypad">
      <div className={styles.screen}>
        <input
          type="text"
          className={styles.inputField}
          value={localValue}
          readOnly
          placeholder=""
          aria-label="Current numerical value"
        />
      </div>

      <div className={styles.keys}>
        <button className={styles.key} onClick={() => handlePress("1")} aria-label="1">1</button>
        <button className={styles.key} onClick={() => handlePress("2")} aria-label="2">2</button>
        <button className={styles.key} onClick={() => handlePress("3")} aria-label="3">3</button>

        <button className={styles.key} onClick={() => handlePress("4")} aria-label="4">4</button>
        <button className={styles.key} onClick={() => handlePress("5")} aria-label="5">5</button>
        <button className={styles.key} onClick={() => handlePress("6")} aria-label="6">6</button>

        <button className={styles.key} onClick={() => handlePress("7")} aria-label="7">7</button>
        <button className={styles.key} onClick={() => handlePress("8")} aria-label="8">8</button>
        <button className={styles.key} onClick={() => handlePress("9")} aria-label="9">9</button>

        <button className={styles.key} onClick={() => handlePress(".")} aria-label="Decimal point">.</button>
        <button className={styles.key} onClick={() => handlePress("0")} aria-label="0">0</button>
        <button className={styles.key} onClick={() => handlePress("-")} aria-label="Toggle negative">+/-</button>

        <button className={`${styles.key} ${styles.backspace}`} onClick={() => handlePress("BACKSPACE")} aria-label="Backspace">
          <FiDelete aria-hidden="true" />
        </button>

        <button className={`${styles.key} ${styles.enter}`} onClick={() => handlePress("ENTER")} aria-label="Clear input">
          <FiCheck size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}