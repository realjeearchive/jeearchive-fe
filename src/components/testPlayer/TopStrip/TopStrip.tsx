"use client";

import { useState, useMemo } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TopStrip.module.css";
import { IoAccessibility } from "react-icons/io5";
import { HiOutlineMagnifyingGlassPlus } from "react-icons/hi2";
import AccessibilityPopup from "../AccessibilityPopup/AccessibilityPopup";
import { useScreenMagnifier } from "@/features/tests/useScreenMagnifier";

export function TopStrip() {
  const [openAccessibility, setOpenAccessibility] = useState(false);
  const { toggle } = useScreenMagnifier();
  
  const metadata = useTestEngineStore((s) => s.paperMetadata);

  const formattedBanner = useMemo(() => {
    if (!metadata) return "JEE TEST UPDATED AS PER LATEST NTA PATTERN";

    const { examName, year, date, month, shift } = metadata;

    // FIX: Replace underscore in JEE_MAIN with a space
    const cleanExamName = examName?.replace(/_/g, " ") || "JEE MAIN";

    const parts = [
      cleanExamName,
      year,
      date,
      month,
      shift ? `${shift} SHIFT` : ""
    ].filter(Boolean);

    return `${parts.join(" ").toUpperCase()} UPDATED AS PER LATEST NTA PATTERN`;
  }, [metadata]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.banner}>
          {formattedBanner}
        </div>

        <div className={styles.utilities}>
          <button type="button" className={styles.utilButton} onClick={() => setOpenAccessibility(true)}>
            <span className={`${styles.icon} ${styles.accessibility}`}><IoAccessibility /></span>
            Accessibility
          </button>

          <button type="button" className={styles.utilButton} onClick={toggle}>
            <span className={`${styles.icon} ${styles.magnifier}`}><HiOutlineMagnifyingGlassPlus /></span>
            Screen Magnifier
          </button>
        </div>
      </div>

      <AccessibilityPopup open={openAccessibility} onClose={() => setOpenAccessibility(false)} />
    </>
  );
}