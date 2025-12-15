"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './QuestionsTypeBar.module.css';

const data = [
  { type: 'MCQ Single', accuracy: 82 },
  { type: 'MCQ Multi', accuracy: 68 },
  { type: 'Integer', accuracy: 74 },
  { type: 'Numeric', accuracy: 59 },
];

const QuestionTypeBar: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Question Type Accuracy</h3>
      <p className={styles.subtitle}>
        Which formats you handle best across recent tests.
      </p>

      <div className={styles.chartWrapper}>
        <ResponsiveBar
        data={data}
        keys={['accuracy']}
        indexBy="type"
        theme={dashboardNivoTheme}
        margin={{ top: 20, right: 10, bottom: 40, left: 40 }}
        padding={0.32}
        layout="vertical"
        valueScale={{ type: 'linear', min: 0, max: 100 }}  // ⬅️ put min/max here
        indexScale={{ type: 'band', round: true }}
        colors={['#f97316']}
        borderRadius={4}
        enableGridX={false}
        enableGridY={true}
        axisTop={null}
        axisRight={null}
        axisLeft={{
            tickSize: 0,
            tickPadding: 6,
        }}
        axisBottom={{
            tickSize: 0,
            tickPadding: 10,
        }}
        labelSkipWidth={40}
        labelSkipHeight={18}
        labelTextColor="var(--dashboard-background-color)"
        role="application"
        ariaLabel="Question type accuracy chart"
        isFocusable={false}
        />

      </div>
    </div>
  );
};

export default QuestionTypeBar;
