"use client";

import React from "react";
import { FiTarget, FiActivity, FiCheckCircle, FiCpu } from "react-icons/fi";
import styles from "./GlobalStats.module.css";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatItem = ({ label, value, icon: Icon, color }: StatItemProps) => (
  <div className={styles.statItem}>
    <div className={styles.statHeader}>
      <div className={styles.statContent}>
         <p className={styles.statLabel}>{label}</p>
         <p className={styles.statValue}>{value}</p>
      </div>
      <div 
        className={styles.iconBox}
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={20} />
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
        color="#85DBFB" 
      />
      <StatItem 
        label="Avg Score" 
        value={data.avgScore} 
        icon={FiTarget} 
        color="#FB7185" 
      />
      <StatItem 
        label="Avg Accuracy" 
        value={`${data.accuracy}%`} 
        icon={FiCheckCircle} 
        color="#22C55E" 
      />
      <StatItem 
        label="Consistency" 
        value={data.consistency} 
        icon={FiCpu} 
        color="#F59E0B" 
      />
    </div>
  );
};