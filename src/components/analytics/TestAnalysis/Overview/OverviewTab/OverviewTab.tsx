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
      
      <div className={styles.heroRow}>
        <div className={styles.heroRowScoreCol}>
          <ScoreCard />
        </div>
        <div className={styles.heroRowPercentileCol}>
          <PercentileCard />
        </div>
      </div>
      
      <KeyStatsGrid />

      <div className={styles.detailsRow}>
        <div className={styles.detailsRowSubjectCol}>
          <SubjectSummaryTable />
        </div>
        <div className={styles.detailsRowBenchmarkCol}>
          <ScoreDistribution />
        </div>
      </div>

    </div>
  );
};
