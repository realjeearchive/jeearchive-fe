import React from "react";
import { OVERALL_STATS } from "@/features/analytics/dummyData";
import { FiTarget, FiActivity, FiCheckCircle, FiCpu } from "react-icons/fi";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatItem = ({ label, value, icon: Icon, color }: StatItemProps) => (
  <div className="flex flex-col justify-between p-[18px] px-[20px] rounded-[10px] bg-[var(--dashboard-sidebar-background-color)] border border-[var(--dashboard-sidebar-border-color)] h-full gap-4 min-w-[145px]">
    
    {/* Header Row: Icon + Value */}
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
         <p className="text-[var(--dashboard-font-xs, 12px)] tracking-[0.08em] uppercase text-[var(--dashboard-secondary-text-color)]">
           {label}
         </p>
         <p className="text-[var(--dashboard-font-xl, 24px)] font-semibold leading-tight text-[var(--dashboard-primary-text-color)] mt-1">
           {value}
         </p>
      </div>

      {/* Icon Box matched to dashboard */}
      <div 
        className="w-[40px] h-[40px] rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export const GlobalStats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
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