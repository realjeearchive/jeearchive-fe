"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiAward, FiClock, FiTarget, FiXCircle, FiCheckCircle, FiPlusCircle, FiCheckSquare } from "react-icons/fi";
import styles from "./KeyStatsGrid.module.css";

interface StatBoxProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color: string;
}

const StatBox = ({ label, value, subValue, icon: Icon, color }: StatBoxProps) => {
  return (
    <div className={styles.statBox}>
      <div className={styles.statBoxHeader}>
        
        {/* Content Section */}
        <div className={styles.statBoxContent}>
          <p className={styles.statBoxLabel}>{label}</p>
          
          <div className={styles.valueWrapper}>
            <p className={styles.statBoxValue}>{value}</p>
            {subValue && (
              <span className={styles.statBoxSubText}>
                {subValue}
              </span>
            )}
          </div>
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
      
      {/* 1. CORRECT ANSWERS */}
      <StatBox 
        label="Correct Answers" 
        value={stats.correct} 
        subValue={`/ ${stats.attempted}`} // Simplified text
        icon={FiCheckSquare} 
        color="#10B981" 
      />

      {/* 2. QUESTIONS ATTEMPTED */}
      <StatBox 
        label="Questions" 
        value={`${stats.attempted}/${stats.totalQs}`} 
        subValue="Attempted"
        icon={FiTarget} 
        color="#85DBFB" 
      />

      {/* 3. ACCURACY */}
      <StatBox 
        label="Accuracy" 
        value={`${meta.accuracy}%`} 
        icon={FiCheckCircle} 
        color={meta.accuracy > 80 ? "#22C55E" : "#F59E0B"} 
      />

      {/* 4. POSITIVE SCORE */}
      <StatBox 
        label="Positive" 
        value={`+${stats.positiveScore}`} 
        icon={FiPlusCircle} 
        color="#22C55E"
      />

      {/* 5. NEGATIVE SCORE */}
      <StatBox 
        label="Negative" 
        value={`${stats.negativeScore}`} 
        icon={FiXCircle} 
        color="#EF4444" 
      />

      {/* 6. TIME TAKEN */}
      <StatBox 
        label="Time Taken" 
        value={`${Math.floor(meta.timeTaken / 60)}h ${meta.timeTaken % 60}m`} 
        icon={FiClock} 
        color="#A855F7" 
      />
    </div>
  );
};