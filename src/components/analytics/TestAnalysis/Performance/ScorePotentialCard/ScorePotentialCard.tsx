"use client";

import React from "react";
import styles from "./ScorePotentialCard.module.css";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";

export const ScorePotentialCard = () => {
  const { myScore, totalMarks } = SINGLE_TEST_DATA.meta;
  const { negativeScore } = SINGLE_TEST_DATA.stats;

  const sillyMistakesLoss = 15;
  const potentialScore = myScore + Math.abs(negativeScore) + sillyMistakesLoss;

  const maxDisplay = potentialScore * 1.1;

  return (
    <section className={styles.cardContainer} aria-label="Score potential analysis">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Score Potential Analysis</h3>
          <p className={styles.subtitle}>Actual Score vs What was possible</p>
        </div>
      </div>

      <div className={styles.visualContainer}>
        <div className={styles.barWrapper} aria-label={`Score breakdown: Actual ${myScore}, Lost ${Math.abs(negativeScore)}, Easy Misses ${sillyMistakesLoss}`}>
          <div
            className={`${styles.segment} ${styles.segmentActual}`}
            style={{ width: `${(myScore / maxDisplay) * 100}%` }}
            role="progressbar"
            aria-valuenow={myScore}
            aria-valuemin={0}
            aria-valuemax={Math.round(maxDisplay)}
            aria-label={`Actual score: ${myScore}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentNegative}`}
            style={{
              width: `${(Math.abs(negativeScore) / maxDisplay) * 100}%`,
            }}
            role="progressbar"
            aria-valuenow={Math.abs(negativeScore)}
            aria-valuemin={0}
            aria-valuemax={Math.round(maxDisplay)}
            aria-label={`Lost to negatives: ${Math.abs(negativeScore)}`}
          />
          <div
            className={`${styles.segment} ${styles.segmentMissed}`}
            style={{
              width: `${(sillyMistakesLoss / maxDisplay) * 100}%`,
            }}
            role="progressbar"
            aria-valuenow={sillyMistakesLoss}
            aria-valuemin={0}
            aria-valuemax={Math.round(maxDisplay)}
            aria-label={`Easy misses: ${sillyMistakesLoss}`}
          />
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span
              className={styles.dot}
              style={{ background: "var(--color-brand-primary)" }}
              aria-hidden="true"
            />
            Actual
          </span>
          <span className={styles.statValue}>{myScore}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span
              className={styles.dot}
              style={{ background: "var(--color-error-main)" }}
              aria-hidden="true"
            />
            Lost (Neg)
          </span>
          <span className={styles.statValue}>-{Math.abs(negativeScore)}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>
            <span
              className={styles.dot}
              style={{ background: "var(--border-subtle)" }}
              aria-hidden="true"
            />
            Easy Misses
          </span>
          <span className={styles.statValue}>{sillyMistakesLoss}</span>
          <span className={styles.statSub}>Recoverable</span>
        </div>
      </div>

      <div className={styles.insight}>
        You scored <strong className={styles.insightBold}>{myScore}</strong>, but your true potential was{" "}
        <strong className={styles.insightBold}>{potentialScore}</strong>. Avoiding
        negatives and silly errors in easy questions would have boosted your rank
        by <span className={styles.insightHighlight}>~1,200</span>.
      </div>
    </section>
  );
};