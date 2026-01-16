"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  useTestEngineStore, 
  TestDefinitionWithMetadata  // <--- Import this
} from "@/features/tests/testEngineStore";import { useTestPlayerTheme } from "@/features/tests/useTestPlayerTheme";
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
// import { TestDefinition } from "@/features/tests/types"; // You might need to update this import based on your new types file location if it changed

interface Props {
  year: string;
}

export function TestPlayerLayout({ year }: Props) {
  // 1. Connect to Store
  const {
    testId,
    title,
    sections,
    activeSectionId,
    activeQuestionId,
    questionsById,
    toggleBookmark,

    // Actions
    selectOption,
    saveAndNext,
    clearResponse,
    markForReview,
    submitTest,
    restoreSession,
    syncWithServer,
    tickTimer, // <--- NEW: Import the timer action
  } = useTestEngineStore((s) => s);

  const { theme, setTheme } = useTestPlayerTheme();
  const { cursorTrailEnabled } = useTestPlayerAccessibility();

  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const hasRestored = useRef(false);

  // 2. RESUME & HEARTBEAT LOGIC
  useEffect(() => {
    if (!testId) return;

    // A. RESTORE SESSION (Local Storage check)
    if (!hasRestored.current) {
      const savedDataString = localStorage.getItem(`test_progress_${testId}`);
      
      if (savedDataString) {
        try {
          const savedData = JSON.parse(savedDataString);
          
          if (savedData.testId === testId) {
            console.log("Found saved session, restoring...");
            
            // Construct the definition object typed strictly
            const currentDef: TestDefinitionWithMetadata = {
              id: testId!, // We know it's not null here because it matched savedData.testId
              title: title,
              sections: sections, 
              durationSeconds: savedData.timeLeftSeconds,
              // Optional metadata fields
              year: year,
              mode: "online", 
              exam: "JEE_MAIN" // or pass dynamically if available
            };

            // No 'as any' needed anymore
            restoreSession(savedData, currentDef);
            
            hasRestored.current = true;
          }
        } catch (e) {
          console.error("Failed to restore session", e);
        }
      }
    }

    // B. HEARTBEAT (Server Sync every 60s)
    const intervalId = setInterval(() => {
      syncWithServer();
    }, 60000); 

    return () => clearInterval(intervalId);
  }, [testId, title, sections, restoreSession, syncWithServer, year]);

  // --- NEW: TIMER EFFECT ---
  // This drives the clock and the time tracking metrics
  useEffect(() => {
    if (!testId) return;

    const timerId = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timerId);
  }, [testId, tickTimer]);
  // ------------------------

  // 3. Responsive Logic
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

  // 4. Theme Logic
  useEffect(() => {
    const saved = localStorage.getItem("test-player-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, [setTheme]);

  // 5. Keyboard Shortcuts
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    // if (e.key === "ArrowRight") saveAndNext(); 
  }, [saveAndNext]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);


  // 6. Loading Guard
  if (!testId || !activeSectionId || !activeQuestionId) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Test Environment...</p>
      </div>
    );
  }

  // 7. Active Data Retrieval
  const activeSection = sections.find((s) => s.id === activeSectionId)!;
  const activeQuestionDef = activeSection.questions.find((q) => q.id === activeQuestionId)!;
  const activeQuestionState = questionsById[activeQuestionId];

  const templateQuestion = activeSection.questions[0]; 
  const currentSectionType = templateQuestion?.kind || "single";
  const posMark = templateQuestion?.correctMarks || 4;
  const negMark = templateQuestion?.negativeMarks || 1;

  // 8. Handlers
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
      <TopStrip testTitle={title} />

      <div className={styles.mainGrid}>
        <div className={styles.left}>
          <TitleBar />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />

          <div className={styles.QuestionScrollArea}>
            <QuestionMetaBar
              questionNumber={activeQuestionState.globalQuestionNumber}
              
              // PASS NEW PROPS
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

        {/* RIGHT COLUMN */}
        {/* RIGHT COLUMN */}
        <aside className={`${styles.sidebar} ${isMobile ? (isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed) : ""}`}>
          
          {/* LOGIC: Show Close Arrow ONLY if Mobile AND Sidebar is Open */}
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

      {/* Mobile Toggle */}
      {/* LOGIC: Show Open Arrow ONLY if Mobile AND Sidebar is Closed (!isSidebarOpen) */}
      {isMobile && !isSidebarOpen && (
        <button 
          className={styles.openArrow} 
          onClick={() => setIsSidebarOpen(true)}
        >
          ‹
        </button>
      )}

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