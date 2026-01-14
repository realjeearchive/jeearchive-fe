"use client";

import { useState } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import styles from "./SectionTabsBar.module.css";

// I've used the Filled version to match the screenshot. 
// If you used a different one, just swap this import back to your original!
import { BsInfoCircleFill } from "react-icons/bs"; 

import { SectionStatusPopup } from "../SectionStatusPopup/SectionStatusPopup";

export function SectionTabsBar() {
  const { sections, activeSectionId, setActiveSectionId } = useTestEngineStore((s) => s);
  
  // State for the popup
  const [popupInfo, setPopupInfo] = useState<{ rect: DOMRect; sectionId: string } | null>(null);

  // 1. HOVER HANDLER: Open the popup
  const handleMouseEnter = (e: React.MouseEvent, sectionId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupInfo({ rect, sectionId });
  };

  // 2. LEAVE HANDLER: Close the popup
  const handleMouseLeave = () => {
    setPopupInfo(null);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className={styles.root}>
      {sections.map((sec) => {
        const isActive = sec.id === activeSectionId;
        return (
          <div
            key={sec.id}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => setActiveSectionId(sec.id)}
          >
            <span className={styles.tabLabel}>{sec.label}</span>

            {/* 3. Attach Mouse Events to the Icon Wrapper */}
            <span
              className={styles.infoIcon}
              onMouseEnter={(e) => handleMouseEnter(e, sec.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Replace this with your original icon component if needed */}
              <BsInfoCircleFill size={16} />
            </span>
          </div>
        );
      })}

      {/* 4. Render Popup (Using ! to assert non-null, as per previous fix) */}
      {popupInfo && (
        <SectionStatusPopup
          anchorRect={popupInfo.rect}
          targetSectionId={popupInfo.sectionId}
          onClose={() => setPopupInfo(null)}
        />
      )}
    </div>
  );
}