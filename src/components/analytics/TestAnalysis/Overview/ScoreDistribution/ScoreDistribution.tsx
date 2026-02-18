"use client";

import React from "react";
import { ResponsivePie, PieCustomLayerProps } from "@nivo/pie"; 
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../../Shared/chartTheme";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import styles from "./ScoreDistribution.module.css";

interface PieDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

export const ScoreDistribution = () => {
  const { subjects, meta } = SINGLE_TEST_DATA;

  const data: PieDatum[] = [
    {
      id: "Physics",
      label: "Physics",
      value: subjects.physics.score,
      color: "#22C55E",
    },
    {
      id: "Chemistry",
      label: "Chemistry",
      value: subjects.chemistry.score,
      color: "#F97316",
    },
    {
      id: "Mathematics",
      label: "Maths",
      value: subjects.maths.score,
      color: "#3B82F6",
    },
  ];

  const totalScore = meta.myScore;

  const CenteredMetric = ({ centerX, centerY }: PieCustomLayerProps<PieDatum>) => {
    return (
      <g>
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            fill: "#F3F4F6",
          }}
        >
          {totalScore}
        </text>
        <text
          x={centerX}
          y={centerY + 18}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "10px",
            fill: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: 600,
          }}
        >
          Total
        </text>
      </g>
    );
  };

  return (
    <AnalyticsCard 
      title="Score Distribution" 
      subtitle="Subject-wise Contribution"
      className={styles.cardOverride}
    >
      <div className={styles.chartContainer}>
        <ResponsivePie<PieDatum>
          data={data}
          theme={analyticsChartTheme}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={6}
          colors={(datum) => datum.data.color}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          tooltip={({ datum }) => (
            <div className={styles.tooltip}>
              <span 
                className={styles.tooltipDot} 
                style={{ backgroundColor: datum.color }} 
              />
              <span className={styles.tooltipLabel}>
                {datum.label}:
              </span>
              <span className={styles.tooltipValue}>
                {datum.value}
              </span>
              <span className={styles.tooltipSub}>
                 ({Math.round((datum.value / (totalScore || 1)) * 100)}%)
              </span>
            </div>
          )}
          layers={[
            'arcs', 
            CenteredMetric 
          ]}
        />
      </div>

      <div className={styles.legendFooter}>
        {data.map((item) => (
          <div key={item.id} className={styles.legendItem}>
            <span 
              className={styles.legendDot} 
              style={{ backgroundColor: item.color }} 
            />
            <span className={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>

    </AnalyticsCard>
  );
};
