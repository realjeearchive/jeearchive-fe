"use client";

import React from "react";
import Link from "next/link";
import styles from "./PyqProgressCard.module.css";
import { FiArrowRight } from "react-icons/fi";

interface Props {
  label: "Physics" | "Chemistry" | "Mathematics";
  solved: number;
  total: number;
}

export default function PyqProgressCard({ label, solved, total }: Props) {
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const tone = label === "Mathematics" ? "maths" : label.toLowerCase();

  const isZero = solved === 0;

  const subjectSlug = label === "Mathematics" ? "maths" : label.toLowerCase();
  const targetHref = `/chapter-wise-questions/${subjectSlug}`;

  return (
    <article
      className={`${styles.card} ${styles[tone]} ${isZero ? styles.zeroState : ""}`}
      aria-label={`${label}: ${solved} of ${total} questions solved`}
    >
      <div className={styles.gradientOverlay} aria-hidden="true" />

      <div className={styles.header}>
        <h3 className={styles.label}>{label}</h3>
        <div className={styles.meta}>Last 5 Years</div>
      </div>

      <div className={styles.main}>
        <div className={styles.circleWrapper}>
          <svg
            viewBox="0 0 100 100"
            className={styles.progressSvg}
            aria-hidden="true"
            role="img"
          >
            <circle className={styles.bg} cx="50" cy="50" r="45" />

            <circle
              className={styles.progress}
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - (283 * percentage) / 100,
                opacity: isZero ? 0 : 1,
              }}
            />
          </svg>

          <div className={styles.center}>
            <div className={`${styles.value} ${isZero ? styles.valueZero : ""}`}>
              {solved}
              <span className={styles.total}> / {total}</span>
            </div>

            {isZero ? (
              <Link
                href={targetHref}
                className={styles.startLabel}
                style={{ textDecoration: "none", cursor: "pointer" }}
                aria-label={`Start ${label} practice`}
              >
                Start <FiArrowRight size={10} aria-hidden="true" />
              </Link>
            ) : (
              <div className={styles.solvedLabel}>Solved</div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}