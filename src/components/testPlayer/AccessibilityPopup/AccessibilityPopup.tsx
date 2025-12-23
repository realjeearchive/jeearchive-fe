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
  cursorSize, setCursorSize
} = useTestPlayerAccessibility();



  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div ref={ref} className={styles.popup}>
        <h2 className={styles.title}>Accessibility Adjustments</h2>

        <div className={styles.grid}>
          {/* Dark mode */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Switch to Dark Mode</p>

            <div className={styles.row}>
              <IoSunnyOutline size={20} />

              <div
                className={styles.toggle}
                data-active={theme === "dark"}
                onClick={toggleTheme}
              />

              <IoMoonOutline size={20} />
            </div>
          </div>

          {/* Font size */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Select Font Size</p>

            <div className={styles.circleGroup}>
              <div
                className={`${styles.circle} ${
                  fontSize === "small" ? styles.active : ""
                }`}
                onClick={() => setFontSize("small")}
              >
                A
              </div>

              <div
                className={`${styles.circle} ${
                  fontSize === "medium" ? styles.active : ""
                }`}
                onClick={() => setFontSize("medium")}
              >
                A
              </div>

              <div
                className={`${styles.circle} ${
                  fontSize === "large" ? styles.active : ""
                }`}
                onClick={() => setFontSize("large")}
              >
                A
              </div>
            </div>
          </div>


          {/* Cursor trail */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Enable Cursor Trail</p>
            <div className={styles.row}>
              <FiMousePointer size={22} />

              <div
                className={styles.toggle}
                data-active={cursorTrailEnabled}
                onClick={toggleCursorTrail}
              />
            </div>
          </div>


          {/* Cursor size */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>Choose Cursor Trail Size</p>

            <div className={styles.circleGroup}>
              <div
                className={`${styles.circle} ${
                  cursorSize === "small" ? styles.active : ""
                }`}
                onClick={() => setCursorSize("small")}
              >
                <FiMousePointer />
              </div>

              <div
                className={`${styles.circle} ${
                  cursorSize === "medium" ? styles.active : ""
                }`}
                onClick={() => setCursorSize("medium")}
              >
                <GrCursor />
              </div>

              <div
                className={`${styles.circle} ${
                  cursorSize === "large" ? styles.active : ""
                }`}
                onClick={() => setCursorSize("large")}
              >
                <GiArrowCursor />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
