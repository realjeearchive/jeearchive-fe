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
import { useRouter } from "next/navigation";

export function TestPlayerLayout() {
  const {
    testId,
    title,
    sections,
    activeSectionId,
    activeQuestionId,
    questionsById,
    isInitialized,
    selectOption,
    saveAndNext,
    clearResponse,
    markForReview,
    syncWithServer,
    startTimer, // 🔥 Brought in startTimer
    stopTimer,  // 🔥 Brought in stopTimer
  } = useTestEngineStore((s) => s);

  const { theme, setTheme } = useTestPlayerTheme();
  const { cursorTrailEnabled } = useTestPlayerAccessibility();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // OPTIMIZED: 2 Minute Sync Interval
  useEffect(() => {
    if (!isInitialized || !testId) return;
    const syncInterval = setInterval(() => { 
      syncWithServer(); 
    }, 120000); 
    return () => clearInterval(syncInterval);
  }, [isInitialized, testId, syncWithServer]);

  // 🔥 FIXED: Centralized timer logic using the store's built-in actions
  useEffect(() => {
    if (!isInitialized) return;
    startTimer();
    return () => {
      stopTimer();
    };
  }, [isInitialized, startTimer, stopTimer]);

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

  useEffect(() => {
    const saved = localStorage.getItem("test-player-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, [setTheme]);

  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    // Add logging here later if needed for shortcuts
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  if (!isInitialized || !activeSectionId || !activeQuestionId) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Question Data...</p>
      </div>
    );
  }

  const activeSection = sections.find((s) => s.id === activeSectionId);
  if (!activeSection) return <div>Error: Active section not found.</div>;

  const activeQuestionDef = activeSection.questions.find((q) => q.id === activeQuestionId);
  if (!activeQuestionDef) return <div>Error: Active question not found.</div>;

  const activeQuestionState = questionsById[activeQuestionId];
  if (!activeQuestionState) return <div>Error: Question state missing.</div>;

  const templateQuestion = activeSection.questions[0]; 
  const currentSectionType = templateQuestion?.kind || "single";
  const posMark = templateQuestion?.correctMarks || 4;
  const negMark = templateQuestion?.negativeMarks || 1;

  const handleSubmit = () => {
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/submit`);
  };

  return (
    <div id="test-player-root" className={`${styles.page} ${theme === "dark" ? "dark" : ""}`}>
      <TopStrip />
      <div className={styles.mainGrid}>
        <div className={styles.left}>
          <TitleBar />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />
          <div className={styles.QuestionScrollArea}>
            <QuestionMetaBar
              questionNumber={activeQuestionState.localQuestionNumber}
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
        <aside className={`${styles.sidebar} ${isMobile ? (isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed) : ""}`}>
          {isMobile && isSidebarOpen && (
            <button className={styles.closeArrow} onClick={() => setIsSidebarOpen(false)}>›</button>
          )}
          <div className={styles.sidebarContent}>
            <Sidebar />
          </div>
        </aside>
      </div>
      {isMobile && !isSidebarOpen && (
        <button className={styles.openArrow} onClick={() => setIsSidebarOpen(true)}>‹</button>
      )}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          <StatusButton label="Mark for Review & Next" variant="outline" onClick={markForReview} />
          <StatusButton label="Clear Response" variant="outline" onClick={clearResponse} />
        </div>
        <div className={styles.bottomBarRight}>
          <StatusButton label="Save & Next" variant="primary" onClick={saveAndNext} />
          <StatusButton label="Submit" variant="primary" onClick={handleSubmit} />
        </div>
      </footer>
      {cursorTrailEnabled && <CursorTrail />}
      <ScreenMagnifier />
    </div>
  );
}