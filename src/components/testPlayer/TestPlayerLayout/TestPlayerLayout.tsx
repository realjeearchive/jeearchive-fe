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
    // State
    testId,
    title,
    sections,
    activeSectionId,
    activeQuestionId,
    questionsById,
    isInitialized,

    // Actions
    selectOption,
    saveAndNext,
    clearResponse,
    markForReview,
    submitTest,
    toggleBookmark,
    syncWithServer, // <--- API Sync
    tickTimer,      // <--- Global Timer
  } = useTestEngineStore((s) => s);

  // 2. Theme & Accessibility
  const { theme, setTheme } = useTestPlayerTheme();
  const { cursorTrailEnabled } = useTestPlayerAccessibility();

  // 3. UI State
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. HEARTBEAT SYSTEM (Background Sync)
  // Syncs to backend every 3 minutes (180,000ms)
  useEffect(() => {
    if (!isInitialized || !testId) return;

    const syncInterval = setInterval(() => {
      syncWithServer();
    }, 180000); 

    return () => clearInterval(syncInterval);
  }, [isInitialized, testId, syncWithServer]);

  // 5. GLOBAL TIMER (1-second tick)
  useEffect(() => {
    if (!isInitialized) return;

    const timerId = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timerId);
  }, [isInitialized, tickTimer]);

  // 6. Responsive Logic
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

  // 7. Theme Persistence
  useEffect(() => {
    const saved = localStorage.getItem("test-player-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, [setTheme]);

  // 8. Keyboard Shortcuts
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    // Example: ArrowRight for Next (Commented out for safety)
    // if (e.key === "ArrowRight") saveAndNext(); 
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  // --- RENDER GUARDS ---

  if (!isInitialized || !activeSectionId || !activeQuestionId) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Question Data...</p>
      </div>
    );
  }

  // --- ACTIVE DATA RESOLUTION ---
  const activeSection = sections.find((s) => s.id === activeSectionId);
  if (!activeSection) return <div>Error: Active section not found.</div>;

  const activeQuestionDef = activeSection.questions.find((q) => q.id === activeQuestionId);
  if (!activeQuestionDef) return <div>Error: Active question not found.</div>;

  const activeQuestionState = questionsById[activeQuestionId];
  if (!activeQuestionState) return <div>Error: Question state missing.</div>;

  // Metadata for Header
  const templateQuestion = activeSection.questions[0]; 
  const currentSectionType = templateQuestion?.kind || "single";
  const posMark = templateQuestion?.correctMarks || 4;
  const negMark = templateQuestion?.negativeMarks || 1; // Default to 1 if missing

  // Handlers
  const handleSaveAndNext = () => saveAndNext();
  const handleClearResponse = () => clearResponse();
  const handleMarkForReview = () => markForReview();
  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the test? This action cannot be undone.")) {
      submitTest();
    }
  };

  return (
    <div id="test-player-root" className={`${styles.page} ${theme === "dark" ? "dark" : ""}`}>
      <TopStrip testTitle={title} />

      <div className={styles.mainGrid}>
        {/* LEFT COLUMN: Question Area */}
        <div className={styles.left}>
          <TitleBar />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />

          <div className={styles.QuestionScrollArea}>
            <QuestionMetaBar
              questionNumber={activeQuestionState.globalQuestionNumber}
              isBookmarked={activeQuestionState.isBookmarked}
              onToggleBookmark={() => toggleBookmark(activeQuestionId)}
            />

            <main id="question-content-area">
              <section className={styles.questionArea}>
                <SectionInstructionsBox
                  title={activeSection.label}
                  maxMarks={activeSection.questions.length * posMark} 
                  questionCount={activeSection.questions.length}
                  sectionType={currentSectionType}
                  positiveMark={posMark} 
                  negativeMark={negMark} 
                />

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
          {/* Mobile Close Button */}
          {isMobile && isSidebarOpen && (
            <button 
              className={styles.closeArrow} 
              onClick={() => setIsSidebarOpen(false)} 
            >
              ›
            </button>
          )}
          
          <div className={styles.sidebarContent}>
            <Sidebar />
          </div>
        </aside>
      </div>

      {/* Mobile Open Button */}
      {isMobile && !isSidebarOpen && (
        <button 
          className={styles.openArrow} 
          onClick={() => setIsSidebarOpen(true)}
        >
          ‹
        </button>
      )}

      {/* FOOTER */}
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

      {/* Accessibility Tools */}
      {cursorTrailEnabled && <CursorTrail />}
      <ScreenMagnifier />
    </div>
  );
}