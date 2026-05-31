"use client";

import React from "react";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { TransformedSingleTestUI } from "@/features/analytics/singleTestTransformer";
import styles from "./SubjectSummaryTable.module.css";

interface Props {
  subjects: TransformedSingleTestUI["subjects"];
}

export const SubjectSummaryTable = ({ subjects }: Props) => {
  const subjectsArray = [subjects.maths, subjects.physics, subjects.chemistry];

  return (
    <AnalyticsCard title="Subject Performance" className={styles.cardContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Subject performance summary">
          <thead className={styles.tableHead}>
            <tr>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellLeft}`} scope="col">
                Subject
              </th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`} scope="col">
                Score
              </th>
              <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`} scope="col">
                Attempts
              </th>
              <th
                className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight} ${styles.tableHeaderCellHiddenSm}`}
                scope="col"
              >
                Accuracy
              </th>
              <th
                className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight} ${styles.tableHeaderCellHiddenSm} ${styles.tableHeaderCellRightPadding}`}
                scope="col"
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectsArray.map((sub) => {
              const color =
                sub.name === "Physics"
                  ? "#60A5FA"
                  : sub.name === "Chemistry"
                  ? "#34D399"
                  : "#FB7185";

              return (
                <tr key={sub.name} className={styles.tableRow}>
                  <td className={`${styles.tableCell} ${styles.tableCellLeft}`}>
                    <div className={styles.subjectCell}>
                      <div
                        className={styles.subjectIndicator}
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      ></div>
                      <span className={styles.subjectName}>{sub.name}</span>
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
                  <td
                    className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellHiddenSm}`}
                  >
                    <span
                      className={
                        sub.accuracy >= 80 ? styles.accuracyHigh : styles.accuracyLow
                      }
                    >
                      {sub.accuracy}%
                    </span>
                  </td>
                  <td
                    className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellHiddenSm} ${styles.tableCellRightPadding}`}
                  >
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