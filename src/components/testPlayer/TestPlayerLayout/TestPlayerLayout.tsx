"use client";

import { useEffect } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useTestPlayerTheme } from "@/features/tests/useTestPlayerTheme";
import { useTestPlayerAccessibility } from "@/features/tests/useTestPlayerAccessibility";

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
  const {
    testId,
    sections,
    activeSectionId,
    activeQuestionId,
    questionsById,
    selectOption,
  } = useTestEngineStore((s) => s);

  const { theme, setTheme } = useTestPlayerTheme();
  const { cursorTrailEnabled } = useTestPlayerAccessibility();

  useEffect(() => {
  const handleExit = () => {
    if (!document.fullscreenElement) {
      alert("You have exited full screen mode.");
      // Optional: re-enter fullscreen
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  document.addEventListener("fullscreenchange", handleExit);

  return () => {
    document.removeEventListener("fullscreenchange", handleExit);
  };
}, []);


  // Restore theme on refresh
  useEffect(() => {
    const saved = localStorage.getItem("test-player-theme") as
      | "light"
      | "dark"
      | null;

    if (saved) setTheme(saved);
  }, [setTheme]);

  if (!testId || !activeSectionId || !activeQuestionId) {
    return <div className={styles.loading}>Loading test…</div>;
  }

  const activeSection = sections.find(
    (s) => s.id === activeSectionId
  )!;
  const activeQuestion = questionsById[activeQuestionId];

  const activeQuestionState = sections
    .flatMap((sec) => sec.questions)
    .find((q) => q.id === activeQuestionId)!;

  return (
    <div
      id="test-player-root"
      className={`${styles.page} ${theme === "dark" ? "dark" : ""}`}
    >
      <TopStrip testTitle="" />

      <div className={styles.mainGrid}>
        <div className={styles.left}>
          <TitleBar year={year} />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />

          <div className={styles.QuestionScrollArea}>
            <QuestionMetaBar
            questionNumber={activeQuestion.globalQuestionNumber}
            questionId={activeQuestion.id}
          />

          <main className={styles.main}>
            <section className={styles.questionArea}>
              <SectionInstructionsBox
                title={activeSection.label}
                maxMarks={80}
                questionCount={activeSection.questions.length}
              />

              <QuestionBlock
                question={activeQuestion}
                questionState={activeQuestionState}
                onSelectOption={(optId) =>
                  selectOption(activeQuestion.id, optId)
                }
              />
            </section>
          </main>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      </div>

      <footer className={styles.bottomBar}>
        <StatusButton label="Mark for Review & Next" variant="outline" />
        <StatusButton label="Clear Response" variant="outline" />
        <div className={styles.spacer} />
        <StatusButton label="Save & Next" variant="primary" />
        <StatusButton label="Submit" variant="primary" />
      </footer>

      {cursorTrailEnabled && <CursorTrail />}
      <ScreenMagnifier />
    </div>
  );
}
