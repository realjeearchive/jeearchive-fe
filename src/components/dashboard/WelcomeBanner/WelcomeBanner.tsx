"use client";

import React from "react";
import styles from "./WelcomeBanner.module.css";
import { FiPlay, FiBookOpen, FiBarChart2, FiCheckCircle, FiTarget } from "react-icons/fi";
import Link from "next/link";

const WelcomeBanner = () => {
  return (
    <section className={styles.bannerCard} aria-label="Welcome to JEE Archive">
      <div className={styles.glowEffect} aria-hidden="true"></div>

      <div className={styles.content}>
        <div className={styles.textSide}>
          <h1 className={styles.title}>Welcome to JEE Archive</h1>
          <p className={styles.description}>
            Start your preparation by practicing chapter-wise questions to strengthen weak concepts, or take a full-length mock test to experience the real NTA interface.
          </p>

          <div className={styles.ctaGroup}>
            <Link
              href="/chapter-wise-questions"
              className={styles.primaryBtn}
              aria-label="Practice chapter-wise questions"
            >
              <FiBookOpen size={16} aria-hidden="true" />
              <span>Practice Chapters</span>
            </Link>
            <Link
              href="/previous-year-questions"
              className={styles.secondaryBtn}
              aria-label="Take your first mock test"
            >
              <FiPlay size={16} aria-hidden="true" />
              <span>Take Mock Test</span>
            </Link>
          </div>
        </div>

        <div className={styles.visualSide} aria-hidden="true">
          <div className={styles.simpleGraphic}>
            <div className={styles.gridGraphic}></div>
            <div className={styles.circleGraphic}>
              <FiTarget size={32} className={styles.centerIcon} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;