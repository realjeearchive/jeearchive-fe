"use client";

import { useState, useRef } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./SectionTabsBar.module.css";
import { IoInformationSharp } from "react-icons/io5";
import { SectionStatusPopup } from "../SectionStatusPopup/SectionStatusPopup";

export function SectionTabsBar() {
  const sections = useTestEngineStore((s) => s.sections);
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const setActiveSection = useTestEngineStore((s) => s.setActiveSection);

  const [popupRect, setPopupRect] = useState<DOMRect | null>(null);

  if (!sections.length) return null;

  return (
    <div className={styles.root}>
      <div className={styles.tabsScroller}>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;

          return (
            <div key={section.id} className={styles.tabItem}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.active : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.label}>{section.label}</span>

              <span
                className={styles.informationIcon}
                onMouseEnter={(e) =>
                  setPopupRect(
                    (e.currentTarget as HTMLElement).getBoundingClientRect()
                  )
                }
                onMouseLeave={() => setPopupRect(null)}
              >
                <IoInformationSharp className={styles.infoIcon} />
              </span>
              </button>

            </div>
          );
        })}
      </div>

      {popupRect && (
        <SectionStatusPopup
          anchorRect={popupRect}
          onClose={() => setPopupRect(null)}
        />
      )}
    </div>
  );
}
