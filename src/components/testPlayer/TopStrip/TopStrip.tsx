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

  const formattedBannerText = useTestEngineStore((s) => s.formattedBannerText);

  return (
    <>
      <header className={styles.root} role="banner">
        <div className={styles.banner}>
          {formattedBannerText || "JEE TEST UPDATED AS PER LATEST NTA PATTERN"}
        </div>

        <nav className={styles.utilities} aria-label="Test utilities">
          <button
            type="button"
            className={styles.utilButton}
            onClick={() => setOpenAccessibility(true)}
            aria-label="Open accessibility settings"
          >
            <span className={`${styles.icon} ${styles.accessibility}`} aria-hidden="true">
              <IoAccessibility />
            </span>
            Accessibility
          </button>

          <button
            type="button"
            className={styles.utilButton}
            onClick={toggle}
            aria-label="Toggle screen magnifier"
          >
            <span className={`${styles.icon} ${styles.magnifier}`} aria-hidden="true">
              <HiOutlineMagnifyingGlassPlus />
            </span>
            Screen Magnifier
          </button>
        </nav>
      </header>

      <AccessibilityPopup
        open={openAccessibility}
        onClose={() => setOpenAccessibility(false)}
      />
    </>
  );
}