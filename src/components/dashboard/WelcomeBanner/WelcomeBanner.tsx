"use client";

import React from 'react';
import styles from './WelcomeBanner.module.css';
import { FiPlay, FiBookOpen, FiTrendingUp, FiTarget } from 'react-icons/fi';
import Link from 'next/link';

const WelcomeBanner = () => {
  return (
    <div className={styles.bannerCard}>
      <div className={styles.glowEffect}></div>

      <div className={styles.content}>
        <div className={styles.textSide}>
          <h1 className={styles.title}>Kickstart your JEE Preparation</h1>
          <p className={styles.description}>
            Your dashboard is currently empty. Take a mock test or practice chapter-wise questions 
            to see your detailed performance analysis, AIR prediction, and weakness insights.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link href="/previous-year-questions" className={styles.primaryBtn}>
              <FiPlay size={16} />
              <span>Take First Mock Test</span>
            </Link>
            <Link href="/chapter-wise-questions" className={styles.secondaryBtn}>
              <FiBookOpen size={16} />
              <span>Practice Chapters</span>
            </Link>
          </div>
        </div>

        <div className={styles.imageSide}>
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
    </div>
  );
};

export default WelcomeBanner;