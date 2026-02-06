"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { SCORE_TREND_DATA } from "@/features/analytics/dummyData";
import { analyticsChartTheme } from "../Shared/chartTheme";

export const PerformanceGraph = () => {
  return (
    <AnalyticsCard title="Performance Trend" subtitle="Score progression across recent tests">
      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveLine
          data={SCORE_TREND_DATA}
          theme={analyticsChartTheme}
          margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: 300, // JEE Max Marks
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.0f"
          curve="catmullRom" // Smooth curves
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Test ID",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Score",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          colors={["#85DBFB"]} // Dashboard Highlight Color
          lineWidth={3}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableArea={true}
          areaOpacity={0.1}
          crosshairType="cross"
        />
      </div>
    </AnalyticsCard>
  );
};