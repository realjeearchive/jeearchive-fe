"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import styles from "./PerformanceGraph.module.css";
import { FiBarChart2 } from "react-icons/fi";

interface GraphPoint {
  x: string | number;
  y: number;
}

interface PerformanceGraphProps {
  data: GraphPoint[];
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ data }) => {
  const hasData = data && data.length > 0;
  
  const chartData = [
    {
      id: "Score",
      data: data,
    },
  ];

  return (
    <AnalyticsCard title="Performance Trend" subtitle="Score progression across tests">
      <div className={styles.chartContainer}>
        {hasData ? (
          <ResponsiveLine
            data={chartData}
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
              format: (v) => {
                if (typeof v === 'string' && v.includes(' ')) return v.split(' ')[1];
                return v;
              }, 
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0,
              tickValues: 5
            }}
            enableGridX={false}
            gridYValues={5}
            colors={["#F59E0B"]}
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
            tooltip={({ point }) => (
              <div
                style={{
                  background: "#1E1D1B",
                  padding: "6px 10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              >
                <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted}
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
            <FiBarChart2 size={24} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No performance history found</p>
            <svg className={styles.fakeGraph} viewBox="0 0 100 40" preserveAspectRatio="none">
              <path 
                d="M0 35 Q 25 35, 50 35 T 100 35" 
                fill="none" 
                stroke="var(--dashboard-sidebar-border-color)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
};
