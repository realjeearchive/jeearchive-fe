"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveLine } from "@nivo/line";
import { dashboardNivoTheme } from "@/theme/nivoTheme";
import styles from "./ScoreGrowthChart.module.css";
import { FiLock } from "react-icons/fi";

interface ScoreGrowthChartProps {
  data: Array<{
    id: string | number;
    data: Array<{ x: string | number; y: number }>;
  }>;
}

const ScoreGrowthChart: React.FC<ScoreGrowthChartProps> = ({ data }) => {
  const hasData = data && data.length > 0 && data[0].data.length > 0;

  const dummyData = [
    {
      id: "Mock Score",
      data: [
        { x: "T1", y: 90 },
        { x: "T2", y: 110 },
        { x: "T3", y: 105 },
        { x: "T4", y: 140 },
        { x: "T5", y: 180 },
      ],
    },
  ];

  const chartData = hasData ? data : dummyData;

  return (
    <section className={styles.card} aria-label="Performance trend chart">
      <div className={styles.chartWrapper}>
        <div className={styles.headerRow}>
          <div>
            <h3 className={styles.title}>Performance Trend</h3>
            <p className={styles.subtitle}>Trajectory over recent period.</p>
          </div>
        </div>

        <div className={styles.chartBody}>
          <div className={`${styles.chartContainer} ${!hasData ? styles.blurredChart : ""}`}>
            <ResponsiveLine
              data={chartData}
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
          </div>

          {!hasData && (
            <div className={styles.emptyOverlay}>
              <div className={styles.emptyIconBox} aria-hidden="true">
                <FiLock size={20} />
              </div>
              <p className={styles.emptyText}>Performance Trend Locked</p>
              <span className={styles.emptySubText}>
                Complete your first mock test to generate your growth analytics
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScoreGrowthChart;