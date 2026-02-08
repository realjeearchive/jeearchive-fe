"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SCORE_TREND_DATA } from "@/features/analytics/dummyData";
import { analyticsChartTheme } from "../../Shared/chartTheme";

export const PerformanceGraph = () => {
  return (
    <AnalyticsCard title="Performance Trend" subtitle="Score progression across tests">
      <div style={{ height: "260px", width: "100%" }}>
        <ResponsiveLine
          data={SCORE_TREND_DATA}
          theme={analyticsChartTheme}
          margin={{ top: 20, right: 20, bottom: 30, left: 30 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: 300, 
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.0f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: 0,
            format: (v) => v.split(' ')[1] || v, // Show only "1", "2" etc if format is "Test 1"
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            tickValues: 5
          }}
          enableGridX={false}
          gridYValues={5}
          colors={["#F59E0B"]} // Core Orange
          lineWidth={2}
          pointSize={8}
          pointColor="#1E1D1B"
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          enableArea={true}
          areaOpacity={0.1}
          defs={[
            {
              id: 'gradientA',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: '#F59E0B', opacity: 0.4 },
                { offset: 100, color: '#F59E0B', opacity: 0 },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
          crosshairType="x"
        />
      </div>
    </AnalyticsCard>
  );
};