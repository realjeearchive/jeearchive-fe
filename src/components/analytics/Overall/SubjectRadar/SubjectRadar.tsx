"use client";

import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import type { RadarSliceTooltipProps } from "@nivo/radar";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { analyticsChartTheme } from "../../Shared/chartTheme";
import styles from "./SubjectRadar.module.css";
import { FiCrosshair, FiStar, FiAlertCircle, FiLock } from "react-icons/fi";

interface RadarDataPoint {
  subject: string;
  Accuracy: number;
}

interface SubjectRadarProps {
  data: RadarDataPoint[];
}

const radarTheme = {
  ...analyticsChartTheme,
  grid: {
    line: {
      stroke: "rgba(255, 255, 255, 0.12)",
      strokeWidth: 1,
      strokeDasharray: "5 5",
    },
  },
};

const toRadarData = (items: RadarDataPoint[]): Record<string, unknown>[] => {
  return items.map((item) => ({
    subject: item.subject,
    Accuracy: item.Accuracy,
  }));
};

export const SubjectRadar: React.FC<SubjectRadarProps> = ({ data }) => {
  const hasData = data && data.length > 0 && data.some((item) => item.Accuracy > 0);
  const dummyData = [
    { subject: "Physics", Accuracy: 85 },
    { subject: "Chemistry", Accuracy: 92 },
    { subject: "Mathematics", Accuracy: 78 },
  ];

  const radarData = toRadarData(hasData ? data : dummyData);

  let strongest: RadarDataPoint | null = null;
  let weakest: RadarDataPoint | null = null;

  if (hasData) {
    const sorted = [...data].sort((a, b) => b.Accuracy - a.Accuracy);
    strongest = sorted[0];
    weakest = sorted[sorted.length - 1];
  }

  return (
    <AnalyticsCard title="Subject Balance" subtitle="Average accuracy distribution">
      <div className={styles.chartContainer}>
        <>
            <div className={!hasData ? styles.blurredChart : styles.fullChart}>
              <ResponsiveRadar
                data={radarData}
                keys={["Accuracy"]}
                indexBy="subject"
                theme={radarTheme}
                maxValue={100}
                margin={{ top: 25, right: 30, bottom: 30, left: 30 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor="#F59E0B"
                gridLevels={4}
                gridShape="circular"
                gridLabelOffset={16}
                enableDots={true}
                dotSize={7}
                dotColor="#1E1D1B"
                dotBorderWidth={2}
                dotBorderColor="#F59E0B"
                enableDotLabel={false}
                colors={["#F59E0B"]}
                fillOpacity={0.12}
                blendMode="normal"
                animate={true}
                motionConfig="gentle"
                sliceTooltip={(props: RadarSliceTooltipProps) => {
                  const { data: sliceData } = props;
                  if (!sliceData || sliceData.length === 0) return null;
                  const item = sliceData[0];
                  const subject = String(item.id ?? "");
                  const accuracy = Number(item.value ?? 0);
                  return (
                    <div className={styles.tooltip}>
                      <span className={styles.tooltipSubject}>{subject}</span>
                      <span className={styles.tooltipValue}>
                        {accuracy}% accuracy
                      </span>
                    </div>
                  );
                }}
              />
            </div>
            {!hasData && (
              <div className={styles.emptyOverlay}>
                <div className={styles.emptyIconBox} aria-hidden="true">
                  <FiLock size={22} />
                </div>
                <span className={styles.emptyTitle}>Subject Balance Locked</span>
                <span className={styles.emptySub}>Take a test to view your balance</span>
              </div>
            )}
          </>
      </div>
    </AnalyticsCard>
  );
};