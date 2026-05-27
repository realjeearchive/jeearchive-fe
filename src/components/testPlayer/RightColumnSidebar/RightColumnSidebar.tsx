"use client";

import Image from "next/image";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { useUserStore } from "@/store/userStore";
import styles from "./RightColumnSidebar.module.css";
import PlaceholderImage from "@/assets/image/placeholder.png";

import { StatusIndicator } from "../StatusIndicator/StatusIndicator";
import QuestionPalette from "../QuestionPalette/QuestionPalette";

export function Sidebar() {
  const user = useUserStore((s) => s.profile);
  
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const sections = useTestEngineStore((s) => s.sections);
  const questionsById = useTestEngineStore((s) => s.questionsById);
  const activeQuestionId = useTestEngineStore((s) => s.activeQuestionId);
  const jumpToQuestion = useTestEngineStore((s) => s.jumpToQuestion);

  const currentSection = sections.find(s => s.id === activeSectionId);
  if (!currentSection) return null;

  // FIX: Map localQuestionNumber so the Palette can see it
  const paletteQuestions = currentSection.questions.map(q => {
    const state = questionsById[q.id];
    return {
      globalQuestionNumber: q.globalQuestionNumber,
      localQuestionNumber: q.localQuestionNumber,
      questionId: q.id,
      status: state.status,
    };
  });

  const allStates = Object.values(questionsById);
  const counts = {
    answered: allStates.filter(q => q.status === 'answered').length,
    notAnswered: allStates.filter(q => q.status === 'notAnswered').length,
    notVisited: allStates.filter(q => q.status === 'notVisited').length,
    markedForReview: allStates.filter(q => q.status === 'markedForReview').length,
    answeredAndMarked: allStates.filter(q => q.status === 'answeredAndMarked').length,
  };

  // FIX: Use localQuestionNumber for correct highlighting in JEE mode
  const currentQState = questionsById[activeQuestionId || ""];
  const currentQNum = currentQState ? currentQState.localQuestionNumber : 0;

  const userName = user?.name || "Candidate";

  return (
    <aside className={styles.sidebar} aria-label="Test navigation sidebar">
      <div className={styles.sidebarInner}>
        <div className={styles.studentProfile}>
          <div className={styles.profile}>
            <Image
              className={styles.profileImage}
              src={PlaceholderImage}
              alt={`${userName}'s profile picture`}
              width={40}
              height={40}
            />
          </div>
          <h2 className={styles.studentName}>
            {userName}
          </h2>
        </div>

        <div className={styles.statusIndicatorContainer}>
          <StatusIndicator counts={counts} />
        </div>

        <h3 className={styles.sectionHeader}>
          {currentSection.label}
        </h3>

        <p className={styles.chooseQuestion} id="palette-instruction">
          Choose a Question
        </p>

        <QuestionPalette
          sectionId={currentSection.id}
          questionCount={currentSection.questions.length}
          currentQuestionNumber={currentQNum}
          questionStates={paletteQuestions}
          onQuestionSelect={(qId) => jumpToQuestion(qId)}
        />
      </div>
    </aside>
  );
}