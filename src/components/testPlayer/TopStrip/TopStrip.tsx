"use client";

import { useState } from "react";
import { HiOutlineMagnifyingGlassPlus } from "react-icons/hi2";
import styles from "./TopStrip.module.css";
import { IoAccessibility, IoInformationSharp } from "react-icons/io5";
import { IoIosPaper } from "react-icons/io";
import AccessibilityPopup from "../AccessibilityPopup/AccessibilityPopup";
import { useScreenMagnifier } from "@/features/tests/useScreenMagnifier";


interface TopStripProps {
  testTitle: string;
}

export function TopStrip({ testTitle }: TopStripProps) {
  const [openAccessibility, setOpenAccessibility] = useState(false);
  const { toggle } = useScreenMagnifier();


  return (
    <>
      <div className={styles.root}>
        <div className={styles.banner}>
          {testTitle} UPDATED AS PER LATEST NTA PATTERN
        </div>

        <div className={styles.utilities}>
          <button
            type="button"
            className={styles.utilButton}
            onClick={() => setOpenAccessibility(true)}
          >
            <span className={`${styles.icon} ${styles.accessibility}`}>
              <IoAccessibility />
            </span>
            Accessibility
          </button>

          <button
            type="button"
            className={styles.utilButton}
            onClick={toggle}
          >
            <span className={`${styles.icon} ${styles.magnifier}`}>
              <HiOutlineMagnifyingGlassPlus />
            </span>
            Screen Magnifier
          </button>

          {/* <button type="button" className={styles.utilButton}>
            <span className={`${styles.icon} ${styles.instructions}`}>
              <IoInformationSharp />
            </span>
            Instructions
          </button>

          <button type="button" className={styles.utilButton}>
            <span className={`${styles.icon} ${styles.questionPaper}`}>
              <IoIosPaper />
            </span>
            Question Paper
          </button> */}
        </div>
      </div>

      <AccessibilityPopup
        open={openAccessibility}
        onClose={() => setOpenAccessibility(false)}
      />
    </>
  );
}
