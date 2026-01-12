"use client";

import { useEffect, useState, useCallback } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useTestPlayerTheme } from "@/features/tests/useTestPlayerTheme";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";

// Components
import { TopStrip } from "../TopStrip/TopStrip";
import { TitleBar } from "../TitleBar/TitleBar";
import { TimeBar } from "../TimeBar/TimeBar";
import { SectionTabsBar } from "../SectionTabsBar/SectionTabsBar";
import { MarksInfoBar } from "../MarksInfoBar/MarksInfoBar";
import { QuestionMetaBar } from "../QuestionMetaBar/QuestionMetaBar";
import { Sidebar } from "../RightColumnSidebar/RightColumnSidebar";
import { SectionInstructionsBox } from "../SectionInstructionsBox/SectionInstructionsBox";
import { QuestionBlock } from "../QuestionBlock/QuestionBlock";
import StatusButton from "../StatusButton/StatusButton";
import CursorTrail from "../CursorTrail/CursorTrail";
import ScreenMagnifier from "../ScreenMagnifier/ScreenMagnifier";

import styles from "./TestPlayerLayout.module.css";

interface Props {
  year: string;
}

export function TestPlayerLayout({ year }: Props) {
  // 1. Connect to Store
  const {
    testId,
    sections,
    activeSectionId,
    activeQuestionId,
    questionsById,
    // Actions
    selectOption,
    saveAndNext,
    clearResponse,
    markForReview,
    submitTest
  } = useTestEngineStore((s) => s);

  const { theme, setTheme } = useTestPlayerTheme();
  const { cursorTrailEnabled } = useTestPlayerAccessibility();

  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Responsive Logic
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // 3. Theme Logic
  useEffect(() => {
    const saved = localStorage.getItem("test-player-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, [setTheme]);

  // 4. Keyboard Shortcuts (Optional UX)
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    // Only triggering Next if not inside an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    
    // Example: Right Arrow for Save & Next
    // if (e.key === "ArrowRight") saveAndNext(); 
  }, [saveAndNext]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);


  // 5. Loading Guard
  if (!testId || !activeSectionId || !activeQuestionId) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Test Environment...</p>
      </div>
    );
  }

  // 6. Active Data Retrieval
  const activeSection = sections.find((s) => s.id === activeSectionId)!;
  const activeQuestionDef = activeSection.questions.find((q) => q.id === activeQuestionId)!;
  const activeQuestionState = questionsById[activeQuestionId];

  // 7. Button Handlers
  const handleSaveAndNext = () => saveAndNext();
  const handleClearResponse = () => clearResponse();
  const handleMarkForReview = () => markForReview();
  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test?")) {
      submitTest();
    }
  };

  return (
    <div id="test-player-root" className={`${styles.page} ${theme === "dark" ? "dark" : ""}`}>
      <TopStrip testTitle="" />

      <div className={styles.mainGrid}>
        {/* LEFT COLUMN: Question Area */}
        <div className={styles.left}>
          <TitleBar year={year} />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />

          <div className={styles.QuestionScrollArea}>
            <QuestionMetaBar
              questionNumber={activeQuestionState.globalQuestionNumber}
              questionId={activeQuestionDef.id}
            />

            <main>
              <section className={styles.questionArea}>
                <SectionInstructionsBox
                  title={activeSection.label}
                  maxMarks={activeSection.questions.length * 4}
                  questionCount={activeSection.questions.length}
                />

                {/* We will update this in Part 3 */}
                <QuestionBlock
                  question={activeQuestionDef}
                  questionState={activeQuestionState}
                  onSelectOption={(val) => selectOption(activeQuestionId, val)}
                />
              </section>
            </main>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className={`${styles.sidebar} ${isMobile ? (isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed) : ""}`}>
          {isMobile && (
            <button className={styles.closeArrow} onClick={() => setIsSidebarOpen(false)}>›</button>
          )}
          <Sidebar />
        </aside>
      </div>

      {/* Mobile Toggle */}
      {isMobile && !isSidebarOpen && (
        <button className={styles.openArrow} onClick={() => setIsSidebarOpen(true)}>‹</button>
      )}

      {/* FOOTER: Action Buttons */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          <StatusButton label="Mark for Review & Next" variant="outline" onClick={handleMarkForReview} />
          <StatusButton label="Clear Response" variant="outline" onClick={handleClearResponse} />
        </div>
        <div className={styles.bottomBarRight}>
          <StatusButton label="Save & Next" variant="primary" onClick={handleSaveAndNext} />
          <StatusButton label="Submit" variant="primary" onClick={handleSubmit} />
        </div>
      </footer>

      {cursorTrailEnabled && <CursorTrail />}
      <ScreenMagnifier />
    </div>
  );
}