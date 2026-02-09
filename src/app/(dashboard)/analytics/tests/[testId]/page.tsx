"use client";

import React, { use } from "react";
import styles from "./analysis.module.css";
import { AnalysisLayout } from "@/components/analytics/TestAnalysis/AnalysisLayout";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiDownload, FiBookOpen } from "react-icons/fi";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export default function SingleTestAnalysisPage(props: PageProps) {
  const { testId } = use(props.params);

  return (
    <div className={styles.pageContainer}>
      
      {/* HEADER ROW */}
      <div className={styles.headerWrapper}>
        <div className={styles.headerRow}>
          {/* Left: Test Info */}
          <div className={styles.testInfo}>
            <h1 className={styles.title}>
              {SINGLE_TEST_DATA.meta.testName}
            </h1>
            <p className={styles.meta}>
              <span>{SINGLE_TEST_DATA.meta.date}</span>
              <span className={styles.dot}></span>
              <span>Full Test</span>
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <div className={styles.contentLayout}>
        <AnalysisLayout />
      </div>

      {/* FOOTER ACTIONS (Moved to Bottom) */}
      <div className={styles.footerActions}>
        <button className={`${styles.btn} ${styles.reportBtn}`}>
          <FiDownload size={14} /> Report
        </button>
        <button className={`${styles.btn} ${styles.solutionsBtn}`}>
          <FiBookOpen size={14} /> View Solutions
        </button>
      </div>

    </div>
  );
}