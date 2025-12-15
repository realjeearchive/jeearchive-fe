// src/components/dashboard/ScoreGrowthChart.tsx
"use client";

import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import { subjectColors } from '@/theme/nivoColors';
import styles from './ScoreGrowthChart.module.css';

const data = [
  {
    id: 'Overall',
    color: subjectColors.overall,
    data: [
      { x: 'Test 1', y: 35 },
      { x: 'Test 2', y: 52 },
      { x: 'Test 3', y: 61 },
      { x: 'Test 4', y: 70 },
      { x: 'Test 5', y: 78 },
    ],
  },
];

const ScoreGrowthChart: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.title}>Score & Predicted Percentile</h3>
          <p className={styles.subtitle}>
            How your performance has changed across recent mock tests.
          </p>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveLine
          data={data}
          theme={dashboardNivoTheme}
          colors={[subjectColors.overall]}
          margin={{ top: 20, right: 24, bottom: 30, left: 40 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100, stacked: false }}
          curve="monotoneX"
          enableArea={true}
          areaOpacity={0.12}
          lineWidth={1.5}
          enablePoints={true}
          pointSize={5}
          pointColor="var(--dashboard-background-color)"
          pointBorderWidth={2}
          pointBorderColor={subjectColors.overall}
          enableGridX={false}
          enableGridY={true}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 6,
            tickRotation: 0,
          }}
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default ScoreGrowthChart;
