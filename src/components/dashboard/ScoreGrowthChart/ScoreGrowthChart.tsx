"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveLine } from "@nivo/line";
import { dashboardNivoTheme } from "@/theme/nivoTheme";
import styles from "./ScoreGrowthChart.module.css";
import { FiActivity } from "react-icons/fi";

interface ScoreGrowthChartProps {
  data: Array<{
    id: string | number;
    data: Array<{ x: string | number; y: number }>;
  }>;
}

const ScoreGrowthChart: React.FC<ScoreGrowthChartProps> = ({ data }) => {
  const hasData = data && data.length > 0 && data[0].data.some((point) => point.y > 0);

  return (
    <section className={styles.card} aria-label="Performance trend chart">
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.title}>Performance Trend</h3>
          <p className={styles.subtitle}>Trajectory over recent period.</p>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveLine
            data={data}
            theme={dashboardNivoTheme}
            colors={["var(--color-brand-primary)"]}
            margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
            curve="catmullRom"
            enableArea={true}
            areaOpacity={0.15}
            lineWidth={2}
            enablePoints={true}
            pointSize={8}
            pointColor="var(--bg-surface)"
            pointBorderWidth={2}
            pointBorderColor="var(--color-brand-primary)"
            enableGridX={false}
            enableGridY={true}
            gridYValues={5}
            axisLeft={{ tickSize: 0, tickPadding: 10 }}
            axisBottom={{ tickSize: 0, tickPadding: 12 }}
            useMesh={true}
            defs={[
              {
                id: "gradientC",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: "var(--color-brand-primary)", opacity: 0.4 },
                  { offset: 100, color: "var(--color-brand-primary)", opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "gradientC" }]}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox} aria-hidden="true">
              <FiActivity size={24} />
            </div>
            <p className={styles.emptyText}>No test history found</p>
            <span className={styles.emptySubText}>
              Take your first mock test to see your growth curve
            </span>

            <Link
              href="/previous-year-questions"
              className={styles.startTestBtn}
              aria-label="Start your first mock test"
            >
              Start Test
            </Link>

            <svg
              className={styles.fakeGraph}
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 35 Q 25 35, 50 35 T 100 35"
                fill="none"
                stroke="var(--border-divider)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScoreGrowthChart;