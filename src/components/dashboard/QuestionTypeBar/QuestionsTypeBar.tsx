"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './QuestionsTypeBar.module.css';
import { FiPieChart } from 'react-icons/fi';

interface QuestionTypeBarProps {
  data: Array<{ type: string; accuracy: number }>;
}

const QuestionTypeBar: React.FC<QuestionTypeBarProps> = ({ data }) => {
  // Check if there is any actual data (accuracy > 0)
  const hasData = data && data.some(item => item.accuracy > 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Question Type Accuracy</h3>
        <p className={styles.subtitle}>Performance by format.</p>
      </div>

      <div className={styles.chartWrapper}>
        {hasData ? (
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
            colors={['#F59E0B']}
            borderRadius={4}
            enableGridX={false}
            enableGridY={true}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            axisBottom={{ tickSize: 0, tickPadding: 10 }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#1E1D1B"
            isInteractive={true}
            role="application"
          />
        ) : (
          /* --- EMPTY STATE --- */
          <div className={styles.emptyState}>
            <div className={styles.emptyBarContainer}>
               {/* Faded Ghost Bars for visual hint */}
               <div className={styles.ghostBar} style={{ height: '40%' }}></div>
               <div className={styles.ghostBar} style={{ height: '60%' }}></div>
            </div>
            <div className={styles.emptyOverlay}>
              <FiPieChart size={20} className={styles.emptyIcon} />
              <span className={styles.emptyText}>No question data yet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionTypeBar;