"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { dashboardNivoTheme } from "@/theme/nivoTheme";
import styles from "./SubjectScoreChart.module.css";
import { FiTrendingUp } from "react-icons/fi";

interface SubjectScoreChartProps {
  data: Array<{
    test: string;
    Physics: number;
    Chemistry: number;
    Mathematics: number;
  }>;
}

const SubjectScoreChart: React.FC<SubjectScoreChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <section className={styles.card} aria-label="Subject Score Contribution Chart">
      <h3 className={styles.title}>Subject Score Breakdown</h3>
      <p className={styles.subtitle}>
        Marks contribution per subject in your recent mock tests.
      </p>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveBar
            data={data}
            keys={["Physics", "Chemistry", "Mathematics"]}
            indexBy="test"
            theme={dashboardNivoTheme}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            padding={0.3}
            layout="vertical"
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            defs={[
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.1)",
                rotation: -45,
                lineWidth: 2,
                spacing: 8,
              },
            ]}
            fill={[
              { match: { id: "Physics" }, id: "lines" },
              { match: { id: "Chemistry" }, id: "lines" },
              { match: { id: "Mathematics" }, id: "lines" },
            ]}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 3]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 10,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 12,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            isInteractive={true}
            tooltip={({ id, value, color, indexValue }) => (
              <div className={styles.tooltip}>
                <strong>{indexValue}</strong> - <span>{id}</span>:
                <span style={{ color, marginLeft: "6px" }}>{value} marks</span>
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.blurredPlaceholder} aria-hidden="true">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <rect x="20" y="50" width="10" height="40" fill="currentColor" opacity="0.3" />
                <rect x="20" y="30" width="10" height="20" fill="currentColor" opacity="0.5" />
                <rect x="20" y="10" width="10" height="20" fill="currentColor" opacity="0.7" />
                
                <rect x="50" y="60" width="10" height="30" fill="currentColor" opacity="0.3" />
                <rect x="50" y="40" width="10" height="20" fill="currentColor" opacity="0.5" />
                <rect x="50" y="10" width="10" height="30" fill="currentColor" opacity="0.7" />
                
                <rect x="80" y="40" width="10" height="50" fill="currentColor" opacity="0.3" />
                <rect x="80" y="20" width="10" height="20" fill="currentColor" opacity="0.5" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <div className={styles.emptyOverlay}>
              <div className={styles.emptyIconBox} aria-hidden="true">
                <FiTrendingUp size={24} />
              </div>
              <p className={styles.emptyText}>Unlock Score Breakdown</p>
              <span className={styles.emptySubText}>
                Complete mock tests to see your subject-wise mark contribution
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubjectScoreChart;
