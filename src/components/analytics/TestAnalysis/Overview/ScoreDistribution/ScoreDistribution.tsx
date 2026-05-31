"use client";

import React from "react";
import { ResponsivePie, PieCustomLayerProps } from "@nivo/pie";
import { AnalyticsCard } from "../../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../../Shared/chartTheme";
import { TransformedSingleTestUI } from "@/features/analytics/singleTestTransformer";
import styles from "./ScoreDistribution.module.css";

interface PieDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  meta: TransformedSingleTestUI["meta"];
  subjects: TransformedSingleTestUI["subjects"];
}

export const ScoreDistribution = ({ meta, subjects }: Props) => {
  const rawData: PieDatum[] = [
    {
      id: "Physics",
      label: "Physics",
      value: Math.max(0, subjects.physics.score),
      color: "#22C55E",
    },
    {
      id: "Chemistry",
      label: "Chemistry",
      value: Math.max(0, subjects.chemistry.score),
      color: "#F97316",
    },
    {
      id: "Mathematics",
      label: "Maths",
      value: Math.max(0, subjects.maths.score),
      color: "#3B82F6",
    },
  ];

  const data = rawData.filter((d) => d.value > 0);
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
        {data.length > 0 ? (
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
                <span className={styles.tooltipLabel}>{datum.label}:</span>
                <span className={styles.tooltipValue}>{datum.value}</span>
              </div>
            )}
            layers={["arcs", CenteredMetric]}
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
              fontSize: "14px",
            }}
            role="status"
          >
            No positive scores to map
          </div>
        )}
      </div>

      <div className={styles.legendFooter} aria-label="Score legend">
        {rawData.map((item) => (
          <div key={item.id} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};