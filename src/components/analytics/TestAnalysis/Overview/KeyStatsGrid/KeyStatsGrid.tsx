"use client";

import React from "react";
import { TransformedSingleTestUI } from "@/features/analytics/singleTestTransformer";
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

interface Props {
  meta: TransformedSingleTestUI['meta'];
  stats: TransformedSingleTestUI['stats'];
}

export const KeyStatsGrid = ({ meta, stats }: Props) => {
  return (
    <div className={styles.container}>
      
      <StatBox 
        label="Correct Answers" 
        value={stats.correct} 
        subValue={`/ ${stats.attempted}`} 
        icon={FiCheckSquare} 
        color="#10B981" 
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
        color={meta.accuracy >= 80 ? "#22C55E" : meta.accuracy >= 50 ? "#F59E0B" : "#EF4444"} 
      />

      <StatBox 
        label="Positive" 
        value={`+${stats.positiveScore}`} 
        icon={FiPlusCircle} 
        color="#22C55E"
      />

      <StatBox 
        label="Negative" 
        value={`${stats.negativeScore}`} 
        icon={FiXCircle} 
        color="#EF4444" 
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