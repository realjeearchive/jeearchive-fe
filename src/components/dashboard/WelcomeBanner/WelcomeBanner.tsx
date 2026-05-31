"use client";

import React from "react";
import styles from "./WelcomeBanner.module.css";
import { FiPlay, FiBookOpen, FiTrendingUp, FiTarget } from "react-icons/fi";
import Link from "next/link";

const WelcomeBanner = () => {
  return (
    <section className={styles.bannerCard} aria-label="Welcome to JEE Archive">
      <div className={styles.glowEffect} aria-hidden="true"></div>

      <div className={styles.content}>
        <div className={styles.textSide}>
          <h1 className={styles.title}>Kickstart your JEE Preparation</h1>
          <p className={styles.description}>
            Your dashboard is currently empty. Take a mock test or practice
            chapter-wise questions to see your detailed performance analysis,
            AIR prediction, and weakness insights.
          </p>

          <div className={styles.ctaGroup}>
            <Link
              href="/previous-year-questions"
              className={styles.primaryBtn}
              aria-label="Take your first mock test"
            >
              <FiPlay size={16} aria-hidden="true" />
              <span>Take First Mock Test</span>
            </Link>
            <Link
              href="/chapter-wise-questions"
              className={styles.secondaryBtn}
              aria-label="Practice chapter-wise questions"
            >
              <FiBookOpen size={16} aria-hidden="true" />
              <span>Practice Chapters</span>
            </Link>
          </div>
        </div>

        <div className={styles.imageSide} aria-hidden="true">
          <div className={styles.visualContainer}>
            <div className={styles.abstractCircleOuter}>
              <div className={styles.abstractCircleInner}>
                <FiTrendingUp size={36} className={styles.mainIcon} />
              </div>
              <div className={styles.floatingIcon}>
                <FiTarget size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;