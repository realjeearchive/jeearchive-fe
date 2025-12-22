"use client";

import Image from "next/image";
import styles from "./RightColumnSidebar.module.css";
import PlaceholderImage from "@/assets/image/placeholder.png";

import { StatusIndicator } from "../StatusIndicator/StatusIndicator";
import QuestionPalette from "../QuestionPalette/QuestionPalette";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        
        {/* Student Profile */}
        <div className={styles.studentProfile}>
          <div className={styles.profile}>
            <Image
              className={styles.profileImage}
              src={PlaceholderImage}
              alt="Profile"
            />
          </div>
          <div className={styles.studentName}>Utkarsh Singh</div>
        </div>

        {/* Status Indicator */}
        <div className={styles.statusIndicatorContainer}>
          <StatusIndicator />
        </div>

        {/* Section Header */}
        <div className={styles.sectionHeader}>
          Mathematics Single Correct
        </div>

        {/* Choose Question Text */}
        <div className={styles.chooseQuestion}>
          Choose a Question
        </div>

        {/* Question Palette */}
        <QuestionPalette
          sectionId="M_SC"
          questionCount={20}
          currentQuestionNumber={2}
          questionStates={[
            { globalQuestionNumber: 1, status: "notAnswered" },
            // rest will default to notVisited
          ]}
          onQuestionSelect={(qNo: number) => {
            console.log("Go to question:", qNo);
          }}

        />
      </div>
    </aside>
  );
}
