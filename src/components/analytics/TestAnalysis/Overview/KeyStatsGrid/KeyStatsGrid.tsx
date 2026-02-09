"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiAward, FiClock, FiTarget, FiXCircle, FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import styles from "./KeyStatsGrid.module.css";

interface StatBoxProps {
  label: string;
  value: string | number;
  subValue?: string; // Used for "Top 35%" or similar
  icon: React.ElementType;
  color: string;
  isNegative?: boolean; // Triggers red delta style
  isPositive?: boolean; // Triggers green delta style
}

const StatBox = ({ label, value, subValue, icon: Icon, color, isNegative, isPositive }: StatBoxProps) => {
  let subValueClass = styles.statBoxSubValueNeutral;
  if (isNegative) subValueClass = styles.statBoxSubValueNegative;
  if (isPositive) subValueClass = styles.statBoxSubValuePositive;

  return (
    <div className={styles.statBox}>
      
      {/* Header: Label + Icon */}
      <div className={styles.statBoxHeader}>
        <div className={styles.statBoxContent}>
          <p className={styles.statBoxLabel}>
            {label}
          </p>
          <p className={styles.statBoxValue}>
            {value}
          </p>
          
          {/* Delta/SubValue Pill */}
          {subValue && (
            <div className={`${styles.statBoxSubValue} ${subValueClass}`}>
              {subValue}
            </div>
          )}
        </div>

        {/* Icon Box */}
        <div 
          className={styles.iconBox}
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export const KeyStatsGrid = () => {
  const { meta, stats } = SINGLE_TEST_DATA;

  return (
    <div className={styles.container}>
      <StatBox 
        label="Global Rank" 
        value={meta.rank} 
        subValue={`Top ${(meta.rank/meta.totalStudents * 100).toFixed(1)}%`}
        icon={FiAward} 
        color="#F59E0B" // Core Orange
      />
      <StatBox 
        label="Questions" 
        value={`${stats.attempted}/${stats.totalQs}`} 
        subValue="Attempted"
        icon={FiTarget} 
        color="#85DBFB" 
      />
      <StatBox 
        label="Accuracy" 
        value={`${meta.accuracy}%`} 
        icon={FiCheckCircle} 
        color={meta.accuracy > 80 ? "#22C55E" : "#F59E0B"} 
      />
       <StatBox 
        label="Positive" 
        value={`+${stats.positiveScore}`} 
        icon={FiPlusCircle} 
        color="#22C55E"
        isPositive={true}
      />
       <StatBox 
        label="Negative" 
        value={`${stats.negativeScore}`} 
        icon={FiXCircle} 
        color="#EF4444" 
        isNegative={true}
      />
       <StatBox 
        label="Time Taken" 
        value={`${Math.floor(meta.timeTaken / 60)}h ${meta.timeTaken % 60}m`} 
        icon={FiClock} 
        color="#A855F7" 
      />
    </div>
  );
};
