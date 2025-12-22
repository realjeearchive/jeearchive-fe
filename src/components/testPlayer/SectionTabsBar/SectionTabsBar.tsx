"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./SectionTabsBar.module.css";
import { IoInformationSharp } from "react-icons/io5";

export function SectionTabsBar() {
  const sections = useTestEngineStore((s) => s.sections);
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const setActiveSection = useTestEngineStore((s) => s.setActiveSection);

  if (!sections.length) return null;

  return (
    <div className={styles.root}>
      <div className={styles.tabsScroller}>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;

          return (
            <button
              key={section.id}
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className={styles.label}>{section.label}</span>
              <span className={styles.informationIcon}><IoInformationSharp className={styles.infoIcon} /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
