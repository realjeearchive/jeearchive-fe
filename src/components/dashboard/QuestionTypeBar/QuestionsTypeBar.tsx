"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './QuestionsTypeBar.module.css';

const data = [
  { type: 'MCQ', accuracy: 82 },
  { type: 'Multi', accuracy: 68 },
  { type: 'Integer', accuracy: 74 },
  { type: 'Num.', accuracy: 59 },
];

const QuestionTypeBar: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Question Type Accuracy</h3>
      <p className={styles.subtitle}>
        Performance by question format.
      </p>

      <div className={styles.chartWrapper}>
        <ResponsiveBar
          data={data}
          keys={['accuracy']}
          indexBy="type"
          theme={dashboardNivoTheme}
          margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
          padding={0.4}
          layout="vertical"
          valueScale={{ type: 'linear', min: 0, max: 100 }} 
          indexScale={{ type: 'band', round: true }}
          colors={['#F59E0B']} // Core Orange
          borderRadius={4}
          enableGridX={false}
          enableGridY={true}
          axisTop={null}
          axisRight={null}
          axisLeft={{
              tickSize: 0,
              tickPadding: 8,
          }}
          axisBottom={{
              tickSize: 0,
              tickPadding: 10,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#1E1D1B" // Dark text on orange bar
          isFocusable={false}
        />
      </div>
    </div>
  );
};

export default QuestionTypeBar;