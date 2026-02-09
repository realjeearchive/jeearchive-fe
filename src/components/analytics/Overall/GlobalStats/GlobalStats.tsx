import React from "react";
import { OVERALL_STATS } from "@/features/analytics/dummyData";
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
    
    {/* Header Row: Icon + Value */}
    <div className={styles.statHeader}>
      <div className={styles.statContent}>
         <p className={styles.statLabel}>
           {label}
         </p>
         <p className={styles.statValue}>
           {value}
         </p>
      </div>

      {/* Icon Box matched to dashboard */}
      <div 
        className={styles.iconBox}
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export const GlobalStats = () => {
  return (
    <div className={styles.container}>
      <StatItem 
        label="Tests Taken" 
        value={OVERALL_STATS.testsAttempted} 
        icon={FiActivity} 
        color="#85DBFB" 
      />
      <StatItem 
        label="Avg Score" 
        value={OVERALL_STATS.averageScore} 
        icon={FiTarget} 
        color="#FB7185" 
      />
      <StatItem 
        label="Avg Accuracy" 
        value={`${OVERALL_STATS.averageAccuracy}%`} 
        icon={FiCheckCircle} 
        color="#22C55E" 
      />
      <StatItem 
        label="Consistency" 
        value={OVERALL_STATS.consistencyScore} 
        icon={FiCpu} 
        color="#F59E0B" 
      />
    </div>
  );
};