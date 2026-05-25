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
  const hasData = data && data.some(item => item.accuracy !== 0);

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
            // 🚨 PRO FIX 1: Massive bottom margin (65) to accommodate -35deg rotated text
            margin={{ top: 20, right: 15, bottom: 65, left: 45 }}
            padding={0.35}
            layout="vertical"
            valueScale={{ type: 'linear', min: 'auto', max: 100 }} 
            indexScale={{ type: 'band', round: true }}
            
            colors={({ data: d }) => {
              if (d.accuracy > 0) return '#F59E0B'; // Amber
              if (d.accuracy < 0) return '#ef4444'; // Red
              return 'rgba(255,255,255,0.05)'; // Ghostly gray for 0%
            }}
            
            enableGridX={false}
            enableGridY={true}
            gridYValues={5} // Keep grid clean
            axisTop={null}
            axisRight={null}
            axisLeft={{ 
              tickSize: 0, 
              tickPadding: 8,
              tickValues: 5, // 🚨 PRO FIX 2: Limit vertical ticks to 5 to prevent Y-axis crowding
              format: (val) => `${val}%`
            }}
            axisBottom={{ 
              tickSize: 0, 
              tickPadding: 12,
              tickRotation: -35 // 🚨 PRO FIX 3: Steeper angle prevents overlap on small screens
            }}
            
            label={(d) => d.value !== 0 ? `${d.value}%` : ''}
            labelTextColor="#ffffff"
            // 🚨 PRO FIX 4: If a bar is shorter than 24px, hide the label to prevent it from spilling out
            labelSkipHeight={24} 
            
            markers={[
              {
                axis: 'y',
                value: 0,
                lineStyle: { stroke: 'rgba(255, 255, 255, 0.4)', strokeWidth: 2 },
              }
            ]}
            
            isInteractive={true}
            tooltip={({ id, value, indexValue }) => (
              <div className={styles.tooltip}>
                <strong>{indexValue}</strong>: 
                <span style={{ color: Number(value) < 0 ? '#ef4444' : '#F59E0B', marginLeft: '6px' }}>
                  {value}%
                </span>
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
             <div className={styles.emptyContent}>
                <span className={styles.emptyText}>No subject data available</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionTypeBar;