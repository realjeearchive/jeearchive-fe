"use client";

import { useState, useEffect } from "react";
import styles from "./VirtualNumpad.module.css";
import { FiDelete, FiCheck } from "react-icons/fi"; 

interface Props {
  // We accept initial value but manage display locally to allow "Clearing Numpad only"
  initialValue: string; 
  onChange: (newValue: string) => void;
}

export default function VirtualNumpad({ initialValue, onChange }: Props) {
  // Local state for the Numpad screen
  const [localValue, setLocalValue] = useState(initialValue || "");

  // Sync local state if parent changes externally (e.g. navigation)
  // But we want to allow local clearing without clearing parent, so we only sync if initialValue is DIFFERENT and non-empty, or handled carefully.
  // Actually, for this specific UX "Tick clears Numpad but keeps Main", we should initialize once.
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handlePress = (key: string) => {
    let nextValue = localValue;

    if (key === "ENTER") {
      // 1. Submit happens automatically on type, so Enter just clears the Numpad screen visually
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

    // Update Local Numpad Screen
    setLocalValue(nextValue);
    
    // Update Main Input Box (Parent)
    onChange(nextValue);
  };

  return (
    <div className={styles.numpadContainer}>
      {/* Numpad Screen (The one that clears on Tick) */}
      <div className={styles.screen}>
        <input
          type="text"
          className={styles.inputField}
          value={localValue}
          readOnly
          placeholder=""
        />
      </div>

      {/* Keys */}
      <div className={styles.keys}>
        <button className={styles.key} onClick={() => handlePress("1")}>1</button>
        <button className={styles.key} onClick={() => handlePress("2")}>2</button>
        <button className={styles.key} onClick={() => handlePress("3")}>3</button>
        
        <button className={styles.key} onClick={() => handlePress("4")}>4</button>
        <button className={styles.key} onClick={() => handlePress("5")}>5</button>
        <button className={styles.key} onClick={() => handlePress("6")}>6</button>
        
        <button className={styles.key} onClick={() => handlePress("7")}>7</button>
        <button className={styles.key} onClick={() => handlePress("8")}>8</button>
        <button className={styles.key} onClick={() => handlePress("9")}>9</button>
        
        <button className={styles.key} onClick={() => handlePress(".")}>.</button>
        <button className={styles.key} onClick={() => handlePress("0")}>0</button>
        <button className={styles.key} onClick={() => handlePress("-")}>+/-</button>
        
        <button className={`${styles.key} ${styles.backspace}`} onClick={() => handlePress("BACKSPACE")}>
          <FiDelete />
        </button>
        
        <button className={`${styles.key} ${styles.enter}`} onClick={() => handlePress("ENTER")}>
          <FiCheck size={20} />
        </button>
      </div>
    </div>
  );
}