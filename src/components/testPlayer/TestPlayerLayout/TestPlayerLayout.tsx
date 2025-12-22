"use client";

import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { TopStrip } from "../TopStrip/TopStrip";
import { TitleBar } from "../TitleBar/TitleBar";
import { TimeBar } from "../TimeBar/TimeBar";
import { SectionTabsBar } from "../SectionTabsBar/SectionTabsBar";
import { MarksInfoBar } from "../MarksInfoBar/MarksInfoBar";
import { QuestionMetaBar } from "../QuestionMetaBar/QuestionMetaBar";
import { Sidebar } from "../RightColumnSidebar/RightColumnSidebar";
import { SectionInstructionsBox } from "../SectionInstructionsBox/SectionInstructionsBox";
import StatusButton from "@/components/testPlayer/StatusButton/StatusButton";
import styles from "./TestPlayerLayout.module.css";
import { QuestionBlock } from "../QuestionBlock/QuestionBlock";
import { useTestPlayerTheme } from "@/features/tests/useTestPlayerTheme";
import { useEffect } from "react";

  


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

  // restore theme on refresh
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

  const activeSection = sections.find(s => s.id === activeSectionId)!;
  const activeQuestion = questionsById[activeQuestionId];

  const activeQuestionState = sections
    .flatMap(sec => sec.questions)
    .find(q => q.id === activeQuestionId)!;

  return (
    <div className={`${styles.page} ${theme === "dark" ? "dark" : ""}`}>
      {/* TOP STRIP */}
      <TopStrip testTitle="" />

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>
        {/* LEFT */}
        <div className={styles.left}>
          <TitleBar year={year} />
          <TimeBar />
          <SectionTabsBar />
          <MarksInfoBar />

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

        {/* RIGHT SIDEBAR */}
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      </div>

      {/* BOTTOM BAR */}
      <footer className={styles.bottomBar}>
        <StatusButton label="Mark for Review & Next" variant="outline" />
        <StatusButton label="Clear Response" variant="outline" />
        <div className={styles.spacer} />
        <StatusButton label="Save & Next" variant="primary" />
        <StatusButton label="Submit" variant="primary" />
      </footer>
    </div>
  );
}
