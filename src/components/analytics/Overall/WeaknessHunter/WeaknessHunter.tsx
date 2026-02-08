"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { WEAK_CHAPTERS } from "@/features/analytics/dummyData";

export const WeaknessHunter = () => {
  return (
    <AnalyticsCard title="Weakness Hunter" subtitle="Priority chapters to revise">
      <div className="flex flex-col gap-2">
        {WEAK_CHAPTERS.map((chapter) => (
          <div 
            key={chapter.id} 
            className="flex items-center justify-between p-2 rounded-[6px] hover:bg-[rgba(255,255,255,0.03)] transition-all group border border-transparent hover:border-[var(--dashboard-dividerline-color)]"
          >
            <div className="flex flex-col gap-1">
              <div className="text-[var(--dashboard-font-sm, 14px)] font-medium text-[var(--dashboard-primary-text-color)] group-hover:text-white transition-colors">
                {chapter.name}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--dashboard-secondary-text-color)] uppercase tracking-wider font-semibold">
                  {chapter.subject}
                </span>
                
                {/* Badge Style */}
                {chapter.weightage === "High" && (
                  <span className="text-[9px] px-1.5 py-[1px] rounded-[999px] bg-[#312820] text-[#F59E0B] border border-[#F59E0B30]">
                    HIGH WTG
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[var(--dashboard-font-sm, 13px)] font-mono text-[var(--dashboard-secondary-text-color)] group-hover:text-[var(--dashboard-primary-text-color)]">
                  {chapter.accuracy}%
                </span>
                {/* Dot Indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--dashboard-negative-delta-color)]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
};