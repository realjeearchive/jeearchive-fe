"use client";

import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import styles from './SubjectBalanceRadar.module.css';

const data = [
  { subject: 'Physics', Accuracy: 72 },
  { subject: 'Chemistry', Accuracy: 81 },
  { subject: 'Maths', Accuracy: 65 },
];

const SubjectBalanceRadar: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Subject Balance</h3>
      <p className={styles.subtitle}>
        Accuracy distribution across subjects.
      </p>

      <div className={styles.chartWrapper}>
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
          isInteractive={true}
        />
      </div>
    </div>
  );
};

export default SubjectBalanceRadar;