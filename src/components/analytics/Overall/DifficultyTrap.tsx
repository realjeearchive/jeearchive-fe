"use client";

import React from "react";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { DIFFICULTY_STRATEGY } from "@/features/analytics/dummyData";
import { FiAlertCircle } from "react-icons/fi";

interface TrapBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const TrapBar = ({ label, count, total, color }: TrapBarProps) => (
  <div className="mb-5 last:mb-0 group">
    <div className="flex justify-between items-end mb-2">
      <span className="text-sm text-[var(--dashboard-secondary-text-color)] group-hover:text-[var(--dashboard-primary-text-color)] transition-colors">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--dashboard-primary-text-color)]">
        {count}
      </span>
    </div>
    
    {/* Track */}
    <div className="w-full bg-[rgba(255,255,255,0.03)] h-1 rounded-full overflow-hidden">
      {/* Bar with Gradient */}
      <div 
        className="h-full rounded-full transition-all duration-700 ease-out" 
        style={{ 
          width: `${Math.min((count / total) * 100, 100)}%`, 
          background: `linear-gradient(90deg, ${color}40, ${color})`, // Fade effect
          boxShadow: `0 0 10px ${color}40` // Subtle glow
        }} 
      />
    </div>
  </div>
);

export const DifficultyTrap = () => {
  return (
    <AnalyticsCard title="Selection Strategy" subtitle="Where marks are leaking">
      <div className="flex flex-col h-full justify-center py-2">
        
        <TrapBar 
          label="Easy Questions Missed" 
          count={DIFFICULTY_STRATEGY.easyMissed} 
          total={100} 
          color="#EF4444" // Red
        />
        
        <TrapBar 
          label="Tough Qs (Wrong Attempt)" 
          count={DIFFICULTY_STRATEGY.toughAttempted} 
          total={50} 
          color="#F59E0B" // Amber
        />

        {/* Minimalist Insight Footer */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="text-[var(--dashboard-highlight-color)] mt-0.5"><FiAlertCircle /></div>
          <p className="text-xs leading-relaxed text-[var(--dashboard-secondary-text-color)]">
            Fixing the <span className="text-[var(--dashboard-primary-text-color)] border-b border-[var(--dashboard-secondary-text-color)]">24 easy misses</span> is your fastest path to +12 marks.
          </p>
        </div>

      </div>
    </AnalyticsCard>
  );
};