"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiAward, FiClock, FiTarget, FiXCircle, FiPlusCircle } from "react-icons/fi";

interface StatBoxProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ElementType;
  color: string;
}

const StatBox = ({ label, value, subValue, icon: Icon, color }: StatBoxProps) => (
  <div className="bg-[var(--dashboard-sidebar-background-color)] border border-[var(--dashboard-sidebar-border-color)] p-4 rounded-xl flex items-start justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors">
    <div>
      <p className="text-[11px] font-bold text-[var(--dashboard-secondary-text-color)] uppercase tracking-wider mb-1">{label}</p>
      <div className="text-2xl font-bold text-[var(--dashboard-primary-text-color)]">{value}</div>
      {subValue && <div className="text-xs text-[var(--dashboard-secondary-text-color)] mt-0.5">{subValue}</div>}
    </div>
    <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15`, color: color }}>
      <Icon size={20} />
    </div>
  </div>
);

// FIX: Use proper SVG Props type instead of any
const FiActivity = (props: React.SVGProps<SVGSVGElement>) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export const KeyStatsGrid = () => {
  const { meta, stats } = SINGLE_TEST_DATA;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <StatBox 
        label="Global Rank" 
        value={meta.rank} 
        subValue={`Top ${(meta.rank/meta.totalStudents * 100).toFixed(1)}%`}
        icon={FiAward} 
        color="#F59E0B" 
      />
      <StatBox 
        label="Questions Attempted" 
        value={`${stats.attempted}/${stats.totalQs}`} 
        icon={FiTarget} 
        color="#85DBFB" 
      />
      <StatBox 
        label="Overall Accuracy" 
        value={`${meta.accuracy}%`} 
        icon={FiActivity} 
        color={meta.accuracy > 80 ? "#22C55E" : "#EF4444"} 
      />
       <StatBox 
        label="Positive Score" 
        value={`+${stats.positiveScore}`} 
        icon={FiPlusCircle} 
        color="#22C55E" 
      />
       <StatBox 
        label="Marks Lost" 
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