"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { OVERVIEW_COMPARISON } from "@/features/analytics/dummyData";

const ComparisonBar = ({ label, value, max, color, isYou = false }: { label: string, value: number, max: number, color: string, isYou?: boolean }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-[11px] mb-1.5 font-medium">
      <span className={`${isYou ? 'text-[var(--dashboard-primary-text-color)]' : 'text-[var(--dashboard-secondary-text-color)]'}`}>
        {label}
      </span>
      <span className="text-[var(--dashboard-primary-text-color)]">{value}</span>
    </div>
    <div className="w-full bg-[rgba(255,255,255,0.05)] h-1.5 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out" 
        style={{ 
          width: `${(value / max) * 100}%`, 
          backgroundColor: color, 
          boxShadow: isYou ? `0 0 10px ${color}40` : 'none' 
        }}
      />
    </div>
  </div>
);

export const ComparativeOverview = () => {
  const { score } = OVERVIEW_COMPARISON;
  const maxScore = 300;

  return (
    <AnalyticsCard title="Benchmarking" subtitle="Vs. Competition" className="h-full bg-[#211f1c] border-[var(--dashboard-sidebar-border-color)]">
      <div className="flex flex-col justify-center h-full gap-2">
        <ComparisonBar 
          label="YOU" 
          value={score.you} 
          max={maxScore} 
          color="#F59E0B" 
          isYou={true}
        />
        <ComparisonBar 
          label="TOPPER" 
          value={score.topper} 
          max={maxScore} 
          color="#22C55E" 
        />
        <ComparisonBar 
          label="AVERAGE" 
          value={score.average} 
          max={maxScore} 
          color="#525252" 
        />
        
        {/* Insight Footer */}
        <div className="mt-4 pt-3 border-t border-[var(--dashboard-dividerline-color)]">
           <p className="text-[11px] text-[var(--dashboard-secondary-text-color)] leading-relaxed">
            <span className="text-[var(--dashboard-primary-text-color)] font-medium">Insight:</span> You trail the topper by <span className="text-[#EF4444] font-medium">-{score.topper - score.you} marks</span>.
           </p>
        </div>
      </div>
    </AnalyticsCard>
  );
};