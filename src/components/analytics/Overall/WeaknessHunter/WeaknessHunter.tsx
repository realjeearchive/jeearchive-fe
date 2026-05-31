"use client";

import React, { useState } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import { FiCheck } from "react-icons/fi";
import styles from "./WeaknessHunter.module.css";

export interface WeaknessItem {
  chapter: string;
  subject: string;
  accuracy: number;
  weightage?: string;
  totalMax: number;
}

interface WeaknessHunterProps {
  data: WeaknessItem[];
}

type SubjectFilter = "All" | "Physics" | "Chemistry" | "Mathematics";

const FilterPills = ({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: SubjectFilter;
  onFilterChange: (f: SubjectFilter) => void;
}) => (
  <div className={styles.filterRow} role="radiogroup" aria-label="Filter by subject">
    {(["All", "Physics", "Chemistry", "Mathematics"] as SubjectFilter[]).map(
      (subj) => (
        <button
          key={subj}
          className={`${styles.filterBtn} ${currentFilter === subj ? styles.activeFilter : ""}`}
          onClick={() => onFilterChange(subj)}
          role="radio"
          aria-checked={currentFilter === subj}
          aria-label={`Filter ${subj === "Mathematics" ? "Maths" : subj}`}
        >
          {subj === "Mathematics" ? "Maths" : subj}
        </button>
      )
    )}
  </div>
);

export const WeaknessHunter: React.FC<WeaknessHunterProps> = ({ data }) => {
  const [filter, setFilter] = useState<SubjectFilter>("All");

  const hasData = data && data.length > 0;

  const filteredData = hasData
    ? data.filter((d) => filter === "All" || d.subject === filter)
    : [];

  const critical = filteredData
    .filter((d) => d.accuracy < 40)
    .map((d) => ({
      x: d.totalMax,
      y: d.accuracy,
      chapter: d.chapter,
      subject: d.subject,
    }));
  const weak = filteredData
    .filter((d) => d.accuracy >= 40 && d.accuracy < 60)
    .map((d) => ({
      x: d.totalMax,
      y: d.accuracy,
      chapter: d.chapter,
      subject: d.subject,
    }));
  const moderate = filteredData
    .filter((d) => d.accuracy >= 60 && d.accuracy <= 100)
    .map((d) => ({
      x: d.totalMax,
      y: d.accuracy,
      chapter: d.chapter,
      subject: d.subject,
    }));

  const chartData = [
    { id: "Critical (<40%)", data: critical },
    { id: "Weak (40-60%)", data: weak },
    { id: "Moderate (>60%)", data: moderate },
  ].filter((series) => series.data.length > 0);

  return (
    <AnalyticsCard
      title="Threat Matrix"
      subtitle="Bottom-right = Highest Priority"
      headerAction={
        <FilterPills currentFilter={filter} onFilterChange={setFilter} />
      }
    >
      <div className={styles.container}>
        {filteredData.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveScatterPlot
              data={chartData}
              theme={analyticsChartTheme}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              xScale={{ type: "linear", min: 0, max: "auto" }}
              yScale={{ type: "linear", min: -5, max: 105 }}
              blendMode="screen"
              colors={["#ef4444", "#f97316", "#F59E0B"]}
              nodeSize={12}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: "Marks at Stake (Impact)",
                legendPosition: "middle",
                legendOffset: 36,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: "Accuracy %",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              enableGridX={false}
              gridYValues={[0, 25, 50, 75, 100]}
              tooltip={({ node }) => (
                <div className={styles.tooltipRoot}>
                  <div className={styles.tooltipContainer}>
                    <div className={styles.tooltipHeader}>
                      <span className={styles.tooltipSubject}>
                        {node.data.subject as string}
                      </span>
                      <div className={styles.tooltipChapter}>
                        {node.data.chapter as string}
                      </div>
                    </div>
                    <div className={styles.tooltipStats}>
                      <div className={styles.statBox}>
                        <span className={styles.statValue}>
                          {Math.round(node.data.y as number)}%
                        </span>
                        <span className={styles.statLabel}>Accuracy</span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statValue}>
                          {Math.round(node.data.x as number)}
                        </span>
                        <span className={styles.statLabel}>Impact</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiCheck size={24} className={styles.emptyIcon} aria-hidden="true" />
            <span className={styles.emptyTitle}>No vulnerabilities found</span>
            <span className={styles.emptySub}>
              You are performing well in {filter}.
            </span>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};