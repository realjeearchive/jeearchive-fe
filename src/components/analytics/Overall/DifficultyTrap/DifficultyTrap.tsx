"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { DIFFICULTY_STRATEGY } from "@/features/analytics/dummyData";
import { FiAlertCircle } from "react-icons/fi";

interface TrapBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const TrapBar = ({ label, count, total, color }: TrapBarProps) => (
  <div className="mb-4 last:mb-0 group">
    <div className="flex justify-between items-end mb-1.5">
      <span className="text-[var(--dashboard-font-xs, 12px)] text-[var(--dashboard-secondary-text-color)] group-hover:text-[var(--dashboard-primary-text-color)] transition-colors font-medium">
        {label}
      </span>
      <span className="text-[var(--dashboard-font-sm, 14px)] font-semibold text-[var(--dashboard-primary-text-color)]">
        {count} <span className="text-[10px] opacity-60 font-normal">Qs</span>
      </span>
    </div>
    
    <div className="w-full bg-[rgba(255,255,255,0.05)] h-1.5 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-700 ease-out" 
        style={{ 
          width: `${Math.min((count / total) * 100, 100)}%`, 
          background: color, // Solid color for cleaner look on dark bg
          boxShadow: `0 0 8px ${color}30`
        }} 
      />
    </div>
  </div>
);

export const DifficultyTrap = () => {
  return (
    <AnalyticsCard title="Selection Strategy" subtitle="Where marks are leaking">
      <div className="flex flex-col h-full justify-center py-1 gap-1">
        
        <TrapBar 
          label="Easy Questions Missed" 
          count={DIFFICULTY_STRATEGY.easyMissed} 
          total={100} 
          color="#EF4444" 
        />
        
        <TrapBar 
          label="Tough Qs (Wrong Attempt)" 
          count={DIFFICULTY_STRATEGY.toughAttempted} 
          total={50} 
          color="#F59E0B" 
        />

        {/* Insight Footer - Styled like a dashboard badge/alert */}
        <div className="mt-4 pt-3 border-t border-[var(--dashboard-dividerline-color)] flex items-start gap-2.5">
          <div className="text-[var(--dashboard-highlight-color)] mt-0.5"><FiAlertCircle size={14} /></div>
          <p className="text-[var(--dashboard-font-xs, 12px)] leading-relaxed text-[var(--dashboard-secondary-text-color)]">
            <span className="text-[var(--dashboard-primary-text-color)] font-medium">Quick Win:</span> Fixing the <span className="text-[var(--dashboard-highlight-color)]">24 easy misses</span> is your fastest path to +12 marks.
          </p>
        </div>

      </div>
    </AnalyticsCard>
  );
};