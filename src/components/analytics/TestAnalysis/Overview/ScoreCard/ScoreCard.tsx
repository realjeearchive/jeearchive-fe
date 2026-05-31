"use client";

import React from "react";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { TransformedSingleTestUI } from "@/features/analytics/singleTestTransformer";
import styles from "./ScoreCard.module.css";

const SubjectRow = ({
  label,
  score,
  total,
  color,
}: {
  label: string;
  score: number;
  total: number;
  color: string;
}) => (
  <div className={styles.subjectRow}>
    <div className={styles.subjectRowHeader}>
      <span className={styles.subjectRowLabel}>{label}</span>
      <div className={styles.subjectRowScore}>
        <span className={styles.subjectRowScoreValue}>{score}</span>
        <span className={styles.subjectRowScoreTotal}>/{total}</span>
      </div>
    </div>
    <div className={styles.subjectProgressBar}>
      <div
        className={styles.subjectProgressBarFill}
        style={{
          width: `${Math.max(0, (score / total) * 100)}%`,
          backgroundColor: color,
        }}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${label}: ${score} out of ${total}`}
      />
    </div>
  </div>
);

interface Props {
  meta: TransformedSingleTestUI["meta"];
  subjects: TransformedSingleTestUI["subjects"];
}

export const ScoreCard = ({ meta, subjects }: Props) => {
  return (
    <AnalyticsCard title="Overall Score" className={styles.cardContainer}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.scoreContainer}>
            <div className={styles.scoreValue}>{meta.myScore}</div>
            <p className={styles.scoreLabel}>OUT OF {meta.totalMarks}</p>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true"></div>

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