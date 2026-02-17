"use client";

import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './SubjectBalanceRadar.module.css';
import { FiCrosshair } from 'react-icons/fi';

interface SubjectBalanceRadarProps {
  data: Array<{ subject: string; Accuracy: number }>;
}

const SubjectBalanceRadar: React.FC<SubjectBalanceRadarProps> = ({ data }) => {
  // Check for valid data (non-zero accuracy)
  const hasData = data && data.some(item => item.Accuracy > 0);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Subject Balance</h3>
      <p className={styles.subtitle}>Accuracy across subjects.</p>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveRadar
            data={data}
            keys={['Accuracy']}
            indexBy="subject"
            theme={dashboardNivoTheme}
            maxValue={100}
            margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor="#F59E0B"
            gridLevels={3}
            gridShape="circular"
            gridLabelOffset={12}
            enableDots={true}
            dotSize={6}
            dotColor="#1E1D1B"
            dotBorderWidth={2}
            dotBorderColor="#F59E0B"
            colors={['#F59E0B']}
            fillOpacity={0.2}
            blendMode="normal"
          />
        ) : (
          /* --- EMPTY STATE --- */
          <div className={styles.emptyState}>
             {/* Abstract circular guides to mimic radar chart */}
             <div className={styles.radarGuideOuter}>
                <div className={styles.radarGuideInner}></div>
             </div>
             
             <div className={styles.emptyContent}>
                <FiCrosshair size={20} className={styles.emptyIcon} />
                <span className={styles.emptyText}>Not enough data</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectBalanceRadar;