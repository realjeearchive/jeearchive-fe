"use client";

import React from "react";
import { ScoreCard } from "../ScoreCard/ScoreCard";
import { PercentileCard } from "../PercentileCard/PercentileCard";
import { KeyStatsGrid } from "../KeyStatsGrid/KeyStatsGrid";
import { SubjectSummaryTable } from "../SubjectSummaryTable/SubjectSummaryTable";
import { ScoreDistribution } from "../ScoreDistribution/ScoreDistribution"; 
import styles from "./OverviewTab.module.css";

import { useSingleTestStore } from "@/store/useSingleTestStore";
import { transformSingleTestData } from "@/features/analytics/singleTestTransformer";

export const OverviewTab = () => {
  const { data } = useSingleTestStore();
  const uiData = transformSingleTestData(data);

  if (!uiData) return null; 

  return (
    <div className={styles.container}>
      
      <div className={styles.heroRow}>
        <div className={styles.heroRowScoreCol}>
          <ScoreCard meta={uiData.meta} subjects={uiData.subjects} />
        </div>
        <div className={styles.heroRowPercentileCol}>
          {/* 🚨 Removed testName prop */}
          <PercentileCard myScore={uiData.meta.myScore} />
        </div>
      </div>
      
      <KeyStatsGrid meta={uiData.meta} stats={uiData.stats} />

      <div className={styles.detailsRow}>
        <div className={styles.detailsRowSubjectCol}>
          <SubjectSummaryTable subjects={uiData.subjects} />
        </div>
        <div className={styles.detailsRowBenchmarkCol}>
          <ScoreDistribution meta={uiData.meta} subjects={uiData.subjects} />
        </div>
      </div>

    </div>
  );
};