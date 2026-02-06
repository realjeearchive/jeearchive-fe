"use client";

import React from "react";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { WEAK_CHAPTERS } from "@/features/analytics/dummyData";

export const WeaknessHunter = () => {
  return (
    <AnalyticsCard title="Weakness Hunter" subtitle="Priority chapters to revise">
      <div className="flex flex-col gap-2">
        {WEAK_CHAPTERS.map((chapter) => (
          <div 
            key={chapter.id} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-[rgba(255,255,255,0.03)] transition-all group border border-transparent hover:border-[rgba(255,255,255,0.05)]"
          >
            <div>
              <div className="text-sm font-medium text-[var(--dashboard-primary-text-color)] group-hover:text-white transition-colors">
                {chapter.name}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-[var(--dashboard-secondary-text-color)] uppercase tracking-wider">
                  {chapter.subject}
                </span>
                
                {/* Glass Badge for Weightage */}
                {chapter.weightage === "High" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B20] text-[#F59E0B] border border-[#F59E0B30]">
                    HIGH WTG
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-mono text-[var(--dashboard-secondary-text-color)]">
                  {chapter.accuracy}%
                </span>
                {/* Visual Indicator Dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--dashboard-negative-delta-color)] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};