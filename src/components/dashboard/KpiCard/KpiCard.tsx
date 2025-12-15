// src/components/dashboard/KpiCard/KpiCard.tsx
import React from 'react';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: string;
  subLabel?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, subLabel }) => {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.pill}>KPI</span>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
      </div>

      {subLabel && (
        <div className={styles.footerRow}>
          <span className={styles.subLabel}>{subLabel}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
