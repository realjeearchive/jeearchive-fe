"use client";

import React from "react";
import { ScoreCard } from "../ScoreCard/ScoreCard";
import { PercentileCard } from "../PercentileCard/PercentileCard";
import { KeyStatsGrid } from "../KeyStatsGrid/KeyStatsGrid";
import { SubjectSummaryTable } from "../SubjectSummaryTable/SubjectSummaryTable";
import { ScoreDistribution } from "../ScoreDistribution/ScoreDistribution"; 
import styles from "./OverviewTab.module.css";

export const OverviewTab = () => {
  return (
    <div className={styles.container}>
      
      {/* 1. HERO ROW: Score (2/3) & Percentile (1/3) */}
      <div className={styles.heroRow}>
        <div className={styles.heroRowScoreCol}>
          <ScoreCard />
        </div>
        <div className={styles.heroRowPercentileCol}>
          <PercentileCard />
        </div>
      </div>
      
      {/* 2. STATS GRID */}
      <KeyStatsGrid />

      {/* 3. DETAILS ROW: Subjects (2/3) & Analytics (1/3) */}
      <div className={styles.detailsRow}>
        <div className={styles.detailsRowSubjectCol}>
          <SubjectSummaryTable />
        </div>
        <div className={styles.detailsRowBenchmarkCol}>
          {/* <ComparativeOverview /> -- Data unavailable for MVP */}
          <ScoreDistribution />
        </div>
      </div>

    </div>
  );
};