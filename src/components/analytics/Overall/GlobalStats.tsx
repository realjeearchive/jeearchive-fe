import React from "react";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { OVERALL_STATS } from "@/features/analytics/dummyData";
import { FiTarget, FiActivity, FiCheckCircle, FiCpu } from "react-icons/fi";

// Define strict types for props
interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType; // Allows passing an Icon component
  color: string;
}

const StatItem = ({ label, value, icon: Icon, color }: StatItemProps) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
    <div 
      className="flex items-center justify-center w-12 h-12 rounded-full"
      style={{ backgroundColor: `${color}20`, color: color }}
    >
      <Icon size={24} />
    </div>
    <div>
      <p className="text-2xl font-bold text-[var(--dashboard-primary-text-color)]">{value}</p>
      <p className="text-sm text-[var(--dashboard-secondary-text-color)] uppercase tracking-wider font-semibold">{label}</p>
    </div>
  </div>
);

export const GlobalStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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