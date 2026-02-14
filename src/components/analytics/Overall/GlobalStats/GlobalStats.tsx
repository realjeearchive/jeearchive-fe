"use client";

import React from "react";
import { FiTarget, FiActivity, FiCheckCircle, FiCpu } from "react-icons/fi";
import styles from "./GlobalStats.module.css";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

const StatItem = ({ label, value, icon: Icon }: StatItemProps) => (
  <div className={styles.statItem}>
    <div className={styles.statHeader}>
      <div className={styles.statContent}>
         <p className={styles.statLabel}>{label}</p>
         <p className={styles.statValue}>{value}</p>
      </div>
      
      {/* Icon Box: Neutral style via CSS class only */}
      <div className={styles.iconBox}>
        <Icon size={16} />
      </div>
    </div>
  </div>
);

interface GlobalStatsProps {
  data: {
    testsTaken: number;
    avgScore: number;
    accuracy: number;
    consistency: number;
  };
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <StatItem 
        label="Tests Taken" 
        value={data.testsTaken} 
        icon={FiActivity} 
      />
      <StatItem 
        label="Avg Score" 
        value={data.avgScore} 
        icon={FiTarget} 
      />
      <StatItem 
        label="Avg Accuracy" 
        value={`${data.accuracy}%`} 
        icon={FiCheckCircle} 
      />
      <StatItem 
        label="Consistency" 
        value={data.consistency} 
        icon={FiCpu} 
      />
    </div>
  );
};