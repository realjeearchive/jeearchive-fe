"use client";

import { useState } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./TopStrip.module.css";
import { IoAccessibility } from "react-icons/io5";
import { HiOutlineMagnifyingGlassPlus } from "react-icons/hi2";
import AccessibilityPopup from "../AccessibilityPopup/AccessibilityPopup";
import { useScreenMagnifier } from "@/features/tests/useScreenMagnifier";

export function TopStrip() {
  const [openAccessibility, setOpenAccessibility] = useState(false);
  const { toggle } = useScreenMagnifier();
  
  // 🔥 FIXED: Grab the pre-calculated string directly
  const formattedBannerText = useTestEngineStore((s) => s.formattedBannerText);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.banner}>
          {formattedBannerText || "JEE TEST UPDATED AS PER LATEST NTA PATTERN"}
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