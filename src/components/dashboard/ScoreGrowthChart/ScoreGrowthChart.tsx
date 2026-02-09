"use client";

import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
// import { subjectColors } from '@/theme/nivoColors'; // Not needed if hardcoding core color
import styles from './ScoreGrowthChart.module.css';

const data = [
  {
    id: 'Overall',
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
          <h3 className={styles.title}>Score Trend</h3>
          <p className={styles.subtitle}>
            Your performance trajectory across recent mock tests.
          </p>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveLine
          data={data}
          theme={dashboardNivoTheme}
          colors={['#F59E0B']} // Core Orange
          margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 100, stacked: false }}
          curve="catmullRom"
          enableArea={true}
          areaOpacity={0.15}
          lineWidth={2}
          enablePoints={true}
          pointSize={8}
          pointColor="#1E1D1B"
          pointBorderWidth={2}
          pointBorderColor="#F59E0B"
          enableGridX={false}
          enableGridY={true}
          gridYValues={5}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
          }}
          useMesh={true}
          defs={[
            {
              id: 'gradientC',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: '#F59E0B', opacity: 0.4 },
                { offset: 100, color: '#F59E0B', opacity: 0 },
              ],
            },
          ]}
          fill={[{ match: '*', id: 'gradientC' }]}
        />
      </div>
    </div>
  );
};

export default ScoreGrowthChart;