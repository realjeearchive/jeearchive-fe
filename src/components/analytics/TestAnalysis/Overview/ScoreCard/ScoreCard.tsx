"use client";

import React from "react";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import styles from "./ScoreCard.module.css";

const SubjectRow = ({ label, score, total, color }: { label: string, score: number, total: number, color: string }) => (
  <div className={styles.subjectRow}>
    <div className={styles.subjectRowHeader}>
      <span className={styles.subjectRowLabel}>
        {label}
      </span>
      <div className={styles.subjectRowScore}>
        <span className={styles.subjectRowScoreValue}>{score}</span>
        <span className={styles.subjectRowScoreTotal}>/{total}</span>
      </div>
    </div>
    <div className={styles.subjectProgressBar}>
      <div 
        className={styles.subjectProgressBarFill} 
        style={{ width: `${(score / total) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const ScoreCard = () => {
  const { meta, subjects } = SINGLE_TEST_DATA;

  return (
    <AnalyticsCard title="Overall Score" className={styles.cardContainer}>
      {/* Background Glow */}
      <div className={styles.bgGlow} />
       
      <div className={styles.content}>
        
        {/* Left: Big Score Display */}
        <div className={styles.leftSection}>
          <div className={styles.scoreContainer}>
             <div className={styles.scoreValue}>
              {meta.myScore}
             </div>
             <p className={styles.scoreLabel}>
               OUT OF {meta.totalMarks}
             </p>
          </div>
        </div>

        {/* Divider (Hidden on mobile) */}
        <div className={styles.divider}></div>

        {/* Right: Subject Split */}
        <div className={styles.rightSection}>
          <SubjectRow 
            label="Mathematics" 
            score={subjects.maths.score} 
            total={subjects.maths.total} 
            color="#FB7185" 
          />
          <SubjectRow 
            label="Physics" 
            score={subjects.physics.score} 
            total={subjects.physics.total} 
            color="#60A5FA" 
          />
          <SubjectRow 
            label="Chemistry" 
            score={subjects.chemistry.score} 
            total={subjects.chemistry.total} 
            color="#34D399" 
          />
        </div>
      </div>
    </AnalyticsCard>
  );
};
