"use client";

import React from "react";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { OVERVIEW_COMPARISON } from "@/features/analytics/dummyData";
import styles from "./SubjectSummaryTable.module.css";

export const SubjectSummaryTable = () => {
  return (
    <AnalyticsCard title="Subject Performance" className={styles.cardContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellLeft}`}>Subject</th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Score</th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Attempts</th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight} ${styles.tableHeaderCellHiddenSm}`}>Accuracy</th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight} ${styles.tableHeaderCellHiddenSm} ${styles.tableHeaderCellRightPadding}`}>Time</th>
            </tr>
          </thead>
          <tbody>
            {OVERVIEW_COMPARISON.subjects.map((sub) => {
               const color = 
               sub.name === "Physics" ? "#60A5FA" :
               sub.name === "Chemistry" ? "#34D399" : "#FB7185";

              return (
                <tr key={sub.name} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.tableCellLeft}`}>
                    <div className={styles.subjectCell}>
                      <div className={styles.subjectIndicator} style={{ backgroundColor: color }}></div>
                      <span className={styles.subjectName}>
                        {sub.name}
                      </span>
                    </div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                    <span className={styles.scoreValue}>{sub.score}</span>
                    <span className={styles.scoreTotal}>/{sub.total}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                    <div className={styles.attemptsCell}>
                      <span className={styles.attemptsValue}>{sub.attempted}</span>
                      <span className={styles.attemptsLabel}>Questions</span>
                    </div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellHiddenSm}`}>
                    <span className={sub.accuracy > 80 ? styles.accuracyHigh : styles.accuracyLow}>
                      {sub.accuracy}%
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellHiddenSm} ${styles.tableCellRightPadding}`}>
                    <span className={styles.timeValue}>{sub.time}m</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  );
};
