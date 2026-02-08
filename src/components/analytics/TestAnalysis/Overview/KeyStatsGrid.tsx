"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiAward, FiClock, FiTarget, FiXCircle, FiCheckCircle, FiPlusCircle } from "react-icons/fi";

interface StatBoxProps {
  label: string;
  value: string | number;
  subValue?: string; // Used for "Top 35%" or similar
  icon: React.ElementType;
  color: string;
  isNegative?: boolean; // Triggers red delta style
  isPositive?: boolean; // Triggers green delta style
}

const StatBox = ({ label, value, subValue, icon: Icon, color, isNegative, isPositive }: StatBoxProps) => (
  <div className="flex flex-col justify-between p-[18px] px-[20px] rounded-[10px] bg-[var(--dashboard-sidebar-background-color)] border border-[var(--dashboard-sidebar-border-color)] h-full gap-4 min-w-[145px]">
    
    {/* Header: Label + Icon */}
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] tracking-[0.08em] uppercase text-[var(--dashboard-secondary-text-color)] font-medium">
          {label}
        </p>
        <p className="text-[24px] font-semibold leading-tight text-[var(--dashboard-primary-text-color)] mt-1">
          {value}
        </p>
        
        {/* Delta/SubValue Pill */}
        {subValue && (
          <div className={`
            inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium w-fit
            ${isNegative ? 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border border-[rgba(239,68,68,0.2)]' : ''}
            ${isPositive ? 'bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]' : ''}
            ${!isNegative && !isPositive ? 'bg-[rgba(255,255,255,0.03)] text-[var(--dashboard-secondary-text-color)]' : ''}
          `}>
            {subValue}
          </div>
        )}
      </div>

      {/* Icon Box */}
      <div 
        className="w-[40px] h-[40px] rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export const KeyStatsGrid = () => {
  const { meta, stats } = SINGLE_TEST_DATA;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
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