// src/components/dashboard/KpiCard.tsx
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
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
    </div>
  );
};

export default KpiCard;
