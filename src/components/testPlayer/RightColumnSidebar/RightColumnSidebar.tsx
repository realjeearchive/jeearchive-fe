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
  
  // Store Data
  const activeSectionId = useTestEngineStore((s) => s.activeSectionId);
  const sections = useTestEngineStore((s) => s.sections);
  const questionsById = useTestEngineStore((s) => s.questionsById);
  const activeQuestionId = useTestEngineStore((s) => s.activeQuestionId);
  const jumpToQuestion = useTestEngineStore((s) => s.jumpToQuestion);

  // 1. Get Current Section Data
  const currentSection = sections.find(s => s.id === activeSectionId);
  
  if (!currentSection) return null;

  // 2. Prepare Palette Data (Map ONLY current section questions)
  const paletteQuestions = currentSection.questions.map(q => {
    const state = questionsById[q.id];
    return {
      globalQuestionNumber: q.globalQuestionNumber,
      questionId: q.id,
      status: state.status,
    };
  });

  // 3. Calculate Stats (For the whole paper usually, or section wise)
  // Let's calculate for the WHOLE paper as per NTA standard
  const allStates = Object.values(questionsById);
  const counts = {
    answered: allStates.filter(q => q.status === 'answered').length,
    notAnswered: allStates.filter(q => q.status === 'notAnswered').length,
    notVisited: allStates.filter(q => q.status === 'notVisited').length,
    markedForReview: allStates.filter(q => q.status === 'markedForReview').length,
    answeredAndMarked: allStates.filter(q => q.status === 'answeredAndMarked').length,
  };

  // Find current question number for the "Highlight" effect
  const currentQState = questionsById[activeQuestionId || ""];
  const currentQNum = currentQState ? currentQState.globalQuestionNumber : 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        
        {/* Profile Header */}
        <div className={styles.studentProfile}>
          <div className={styles.profile}>
            <Image
              className={styles.profileImage}
              src={PlaceholderImage} // Or user.imageUrl
              alt="Profile"
              width={40} height={40}
            />
          </div>
          <div className={styles.studentName}>
            {user?.name || "Candidate"}
          </div>
        </div>

        {/* Counts Legend */}
        <div className={styles.statusIndicatorContainer}>
          <StatusIndicator counts={counts} />
        </div>

        {/* Section Label */}
        <div className={styles.sectionHeader}>
          {currentSection.label}
        </div>

        <div className={styles.chooseQuestion}>
          Choose a Question
        </div>

        {/* The Grid */}
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