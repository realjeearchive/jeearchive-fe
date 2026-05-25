"use client";

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './SubjectBalanceRadar.module.css';
import { FiCrosshair } from 'react-icons/fi';

interface SubjectBalanceBarProps {
  data: Array<{ subject: string; Accuracy: number }>;
}

const SubjectBalanceBar: React.FC<SubjectBalanceBarProps> = ({ data }) => {
  const hasData = data && data.some(item => item.Accuracy !== 0);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Subject Balance</h3>
      <p className={styles.subtitle}>Accuracy distribution (Positive vs Negative).</p>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveBar
            data={data}
            keys={['Accuracy']}
            indexBy="subject"
            theme={dashboardNivoTheme}
            // Increased left margin to 85px to ensure "Mathematics" never truncates
            margin={{ top: 10, right: 20, bottom: 40, left: 85 }}
            padding={0.35}
            layout="horizontal"
            valueScale={{ type: 'linear', min: 'auto', max: 100 }}
            indexScale={{ type: 'band', round: true }}
            
            colors={({ data: d }) => {
              if (d.Accuracy > 0) return '#10b981'; // Green
              if (d.Accuracy < 0) return '#ef4444'; // Red
              return '#27272a'; // Gray
            }}
            
            enableGridX={true}
            enableGridY={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 0,
              format: (val) => `${val}%`,
              // 🚨 PRO FIX 1: Limit ticks to max 5 to prevent X-axis number overlap
              tickValues: 5, 
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}
            
            label={(d) => `${d.value}%`}
            labelTextColor="#ffffff"
            // 🚨 PRO FIX 2: If a bar is smaller than 40px wide, hide the text so it doesn't spill out.
            labelSkipWidth={40} 
            
            markers={[
              {
                axis: 'x',
                value: 0,
                lineStyle: { stroke: 'rgba(255, 255, 255, 0.4)', strokeWidth: 2 },
              }
            ]}
            
            isInteractive={true}
            tooltip={({ value, indexValue }) => (
              <div className={styles.tooltip}>
                <strong>{indexValue}</strong>: 
                <span style={{ color: Number(value) < 0 ? '#ef4444' : '#10b981', marginLeft: '6px' }}>
                  {value}%
                </span>
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
             <div className={styles.emptyContent}>
                <FiCrosshair size={24} className={styles.emptyIcon} />
                <span className={styles.emptyText}>No subject data available</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectBalanceBar;