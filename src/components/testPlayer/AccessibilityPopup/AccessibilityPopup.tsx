"use client";

import { useEffect, useRef } from "react";
import styles from "./AccessibilityPopup.module.css";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FiMousePointer } from "react-icons/fi";
import { GiArrowCursor } from "react-icons/gi";
import { GrCursor } from "react-icons/gr";
import { useTestPlayerTheme } from "@/features/tests/useTestPlayerTheme";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AccessibilityPopup({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTestPlayerTheme();
  const {
    fontSize,
    setFontSize,
    cursorTrailEnabled,
    toggleCursorTrail,
    cursorSize,
    setCursorSize,
  } = useTestPlayerAccessibility();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // Handle Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleToggleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Accessibility settings">
      <div ref={ref} className={styles.popup}>
        <h2 className={styles.title}>Accessibility Adjustments</h2>

        <div className={styles.grid}>
          {/* Dark mode */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Switch to Dark Mode</p>

            <div className={styles.row}>
              <IoSunnyOutline size={20} aria-hidden="true" />

              <div
                role="switch"
                aria-checked={theme === "dark"}
                aria-label="Toggle dark mode"
                tabIndex={0}
                className={styles.toggle}
                data-active={theme === "dark"}
                onClick={toggleTheme}
                onKeyDown={(e) => handleToggleKeyDown(e, toggleTheme)}
              />

              <IoMoonOutline size={20} aria-hidden="true" />
            </div>
          </div>

          {/* Font size */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Select Font Size</p>

            <div className={styles.circleGroup}>
              <button
                className={`${styles.circle} ${fontSize === "small" ? styles.active : ""}`}
                onClick={() => setFontSize("small")}
                aria-label="Small font size"
                aria-pressed={fontSize === "small"}
              >
                A
              </button>

              <button
                className={`${styles.circle} ${fontSize === "medium" ? styles.active : ""}`}
                onClick={() => setFontSize("medium")}
                aria-label="Medium font size"
                aria-pressed={fontSize === "medium"}
              >
                A
              </button>

              <button
                className={`${styles.circle} ${fontSize === "large" ? styles.active : ""}`}
                onClick={() => setFontSize("large")}
                aria-label="Large font size"
                aria-pressed={fontSize === "large"}
              >
                A
              </button>
            </div>
          </div>

          {/* Cursor trail */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Enable Cursor Trail</p>
            <div className={styles.row}>
              <FiMousePointer size={22} aria-hidden="true" />

              <div
                role="switch"
                aria-checked={cursorTrailEnabled}
                aria-label="Toggle cursor trail"
                tabIndex={0}
                className={styles.toggle}
                data-active={cursorTrailEnabled}
                onClick={toggleCursorTrail}
                onKeyDown={(e) => handleToggleKeyDown(e, toggleCursorTrail)}
              />
            </div>
          </div>

          {/* Cursor size */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Choose Cursor Trail Size</p>

            <div className={styles.circleGroup}>
              <button
                className={`${styles.circle} ${cursorSize === "small" ? styles.active : ""}`}
                onClick={() => setCursorSize("small")}
                aria-label="Small cursor size"
                aria-pressed={cursorSize === "small"}
              >
                <FiMousePointer aria-hidden="true" />
              </button>

              <button
                className={`${styles.circle} ${cursorSize === "medium" ? styles.active : ""}`}
                onClick={() => setCursorSize("medium")}
                aria-label="Medium cursor size"
                aria-pressed={cursorSize === "medium"}
              >
                <GrCursor aria-hidden="true" />
              </button>

              <button
                className={`${styles.circle} ${cursorSize === "large" ? styles.active : ""}`}
                onClick={() => setCursorSize("large")}
                aria-label="Large cursor size"
                aria-pressed={cursorSize === "large"}
              >
                <GiArrowCursor aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}