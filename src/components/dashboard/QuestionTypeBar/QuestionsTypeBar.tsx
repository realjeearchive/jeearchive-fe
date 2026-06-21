"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { dashboardNivoTheme } from "@/theme/nivoTheme";
import styles from "./QuestionsTypeBar.module.css";
import { FiPieChart } from "react-icons/fi";

interface QuestionTypeBarProps {
  data: Array<{ type: string; accuracy: number }>;
}

const QuestionTypeBar: React.FC<QuestionTypeBarProps> = ({ data }) => {
  const hasData = data && data.some((item) => item.accuracy !== 0);

  return (
    <section className={styles.card} aria-label="Question type accuracy chart">
      <div className={styles.header}>
        <h3 className={styles.title}>Question Type Accuracy</h3>
        <p className={styles.subtitle}>Performance by format.</p>
      </div>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveBar
            data={data}
            keys={["accuracy"]}
            indexBy="type"
            theme={dashboardNivoTheme}
            margin={{ top: 20, right: 15, bottom: 65, left: 45 }}
            padding={0.35}
            layout="vertical"
            valueScale={{ type: "linear", min: "auto", max: 100 }}
            indexScale={{ type: "band", round: true }}

            colors={({ data: d }) => {
              if (d.accuracy > 0) return "#F59E0B";
              if (d.accuracy < 0) return "#ef4444";
              return "rgba(255,255,255,0.05)";
            }}

            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
            axisTop={null}
            axisRight={null}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              tickValues: 5,
              format: (val) => `${val}%`,
            }}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: -35,
            }}

            label={(d) => (d.value !== 0 ? `${d.value}%` : "")}
            labelTextColor="#ffffff"
            labelSkipHeight={24}

            markers={[
              {
                axis: "y",
                value: 0,
                lineStyle: {
                  stroke: "rgba(255, 255, 255, 0.4)",
                  strokeWidth: 2,
                },
              },
            ]}

            isInteractive={true}
            tooltip={({ id, value, indexValue }) => (
              <div className={styles.tooltip}>
                <strong>{indexValue}</strong>:
                <span
                  style={{
                    color: Number(value) < 0 ? "#ef4444" : "#F59E0B",
                    marginLeft: "6px",
                  }}
                >
                  {value}%
                </span>
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.blurredPlaceholder} aria-hidden="true">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="10" y="20" width="80" height="10" fill="currentColor" opacity="0.4" />
                <rect x="10" y="40" width="60" height="10" fill="currentColor" opacity="0.6" />
                <rect x="10" y="60" width="40" height="10" fill="currentColor" opacity="0.3" />
                <rect x="10" y="80" width="70" height="10" fill="currentColor" opacity="0.5" />
                <line x1="10" y1="10" x2="10" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            <div className={styles.emptyOverlay}>
              <div className={styles.emptyIconBox} aria-hidden="true">
                <FiPieChart size={24} />
              </div>
              <p className={styles.emptyText}>Unlock Format Analysis</p>
              <span className={styles.emptySubText}>
                Complete your first mock test to see your accuracy by question type
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestionTypeBar;