"use client";

import React from "react";
import Link from "next/link"; // Added Link
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
  
  // New User Check
  const isZero = solved === 0;

  // Generate Link HREF
  // Mathematics -> maths, Physics -> physics, Chemistry -> chemistry
  const subjectSlug = label === "Mathematics" ? "maths" : label.toLowerCase();
  const targetHref = `/chapter-wise-questions/${subjectSlug}`;

  return (
    <div className={`${styles.card} ${styles[tone]} ${isZero ? styles.zeroState : ''}`}>
      
      {/* Background Gradient Layer */}
      <div className={styles.gradientOverlay} />

      <div className={styles.header}>
        <div className={styles.label}>{label}</div>
        <div className={styles.meta}>Last 5 Years</div>
      </div>

      <div className={styles.main}>
        <div className={styles.circleWrapper}>
          <svg viewBox="0 0 100 100" className={styles.progressSvg}>
            {/* Background Track */}
            <circle className={styles.bg} cx="50" cy="50" r="45" />
            
            {/* Progress Arc */}
            <circle
              className={styles.progress}
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - (283 * percentage) / 100,
                opacity: isZero ? 0 : 1
              }}
            />
          </svg>

          <div className={styles.center}>
            <div className={`${styles.value} ${isZero ? styles.valueZero : ''}`}>
              {solved}
              <span className={styles.total}> / {total}</span>
            </div>
            
            {/* Conditional Label */}
            {isZero ? (
              <Link 
                href={targetHref} 
                className={styles.startLabel}
                style={{ textDecoration: 'none', cursor: 'pointer' }} // Ensure it acts like a link
              >
                Start <FiArrowRight size={10} />
              </Link>
            ) : (
              <div className={styles.solvedLabel}>Solved</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}