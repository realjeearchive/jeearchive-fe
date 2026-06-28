"use client";

import { useState } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./SectionTabsBar.module.css";
import { BsInfoCircleFill } from "react-icons/bs";
import { SectionStatusPopup } from "../SectionStatusPopup/SectionStatusPopup";

import { useShallow } from "zustand/react/shallow";

export function SectionTabsBar() {
  const { sections, activeSectionId, setActiveSectionId } = useTestEngineStore(
    useShallow((s) => ({
      sections: s.sections,
      activeSectionId: s.activeSectionId,
      setActiveSectionId: s.setActiveSectionId,
    }))
  );

  const [popupInfo, setPopupInfo] = useState<{
    rect: DOMRect;
    sectionId: string;
  } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, sectionId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupInfo({ rect, sectionId });
  };

  const handleMouseLeave = () => {
    setPopupInfo(null);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <nav className={styles.root} role="tablist" aria-label="Test sections">
      {sections.map((sec) => {
        const isActive = sec.id === activeSectionId;
        return (
          <button
            key={sec.id}
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => setActiveSectionId(sec.id)}
          >
            <span className={styles.tabLabel}>{sec.label}</span>

            <span
              className={styles.infoIcon}
              onMouseEnter={(e) => handleMouseEnter(e, sec.id)}
              onMouseLeave={handleMouseLeave}
              aria-label={`View status for ${sec.label}`}
            >
              <BsInfoCircleFill size={16} aria-hidden="true" />
            </span>
          </button>
        );
      })}

      {popupInfo && (
        <SectionStatusPopup
          anchorRect={popupInfo.rect}
          targetSectionId={popupInfo.sectionId}
          onClose={() => setPopupInfo(null)}
        />
      )}
    </nav>
  );
}