"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import styles from "./PerformanceGraph.module.css";
import { FiTrendingUp, FiLock } from "react-icons/fi";

interface GraphPoint {
  x: string | number;
  y: number;
}

interface PerformanceGraphProps {
  data: GraphPoint[];
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  const trend =
    hasData && data.length >= 2
      ? data[data.length - 1].y - data[0].y
      : 0;
  const trendLabel =
    trend > 0
      ? `↑ ${trend} pts improvement`
      : trend < 0
      ? `↓ ${Math.abs(trend)} pts decline`
      : "Stable";

  const dummyData = [
    { x: "T1", y: 90 },
    { x: "T2", y: 110 },
    { x: "T3", y: 105 },
    { x: "T4", y: 140 },
    { x: "T5", y: 180 },
  ];

  const chartDataArray = hasData ? data : dummyData;

  const chartData = [
    {
      id: "Score",
      data: chartDataArray,
    },
  ];

  return (
    <AnalyticsCard
      title="Performance Trend"
      subtitle={hasData ? trendLabel : "Score progression across tests"}
    >
      <div className={styles.chartContainer}>
        <div className={!hasData ? styles.blurredChart : styles.fullChart}>
          <ResponsiveLine
            data={chartData}
            theme={analyticsChartTheme}
            margin={{ top: 20, right: 20, bottom: 30, left: 36 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.0f"
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 0,
              tickValues: 4,
              format: (v) => Math.round(v),
            }}
            enableGridX={false}
            enableGridY={true}
            gridYValues={4}
            lineWidth={2.5}
            colors={["#F59E0B"]}
            pointSize={0}
            pointBorderWidth={0}
            pointColor="#F59E0B"
            pointBorderColor="#F59E0B"
            useMesh={true}
            enableArea={true}
            areaOpacity={0.15}
            areaBaselineValue={0}
            defs={[
              {
                id: "areaGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: "#F59E0B", opacity: 0.35 },
                  { offset: 100, color: "#F59E0B", opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: "*", id: "areaGradient" }]}
            crosshairType="cross"
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <div className={styles.tooltip}>
                {slice.points.map((point) => (
                  <div key={point.id} className={styles.tooltipRow}>
                    <span
                      className={styles.tooltipDot}
                      style={{ background: point.seriesColor }}
                    />
                    <span className={styles.tooltipLabel}>{point.data.xFormatted}</span>
                    <span className={styles.tooltipValue}>
                      {point.data.yFormatted} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
            animate={true}
            motionConfig="gentle"
          />
        </div>
        {!hasData && (
          <div className={styles.emptyOverlay}>
            <div className={styles.emptyIconBox} aria-hidden="true">
              <FiLock size={22} />
            </div>
            <span className={styles.emptyTitle}>Performance Trend Locked</span>
            <span className={styles.emptySub}>Complete your first mock test to generate your growth analytics</span>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};