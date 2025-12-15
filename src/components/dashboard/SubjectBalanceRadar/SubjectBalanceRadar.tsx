// src/components/dashboard/SubjectBalanceRadar.tsx
"use client";

import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { dashboardNivoTheme } from '@/theme/nivoTheme';
import { subjectColors } from '@/theme/nivoColors';
import styles from './SubjectBalanceRadar.module.css';

const data = [
  { subject: 'Physics', Accuracy: 72 },
  { subject: 'Chemistry', Accuracy: 81 },
  { subject: 'Mathematics', Accuracy: 65 },
];

const SubjectBalanceRadar: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Subject Balance</h3>
      <p className={styles.subtitle}>
        Higher and more balanced spikes indicate stronger overall prep.
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
          borderWidth={1.5}
          borderColor={subjectColors.physics}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={12}
          enableDots={true}
          dotSize={5}
          dotColor="var(--dashboard-background-color)"
          dotBorderWidth={2}
          dotBorderColor={subjectColors.physics}
          colors={[subjectColors.physics]}
          fillOpacity={0.18}
          blendMode="normal"
          isInteractive={true}
        />
      </div>
    </div>
  );
};

export default SubjectBalanceRadar;
