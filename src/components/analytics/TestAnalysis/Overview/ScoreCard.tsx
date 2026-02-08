"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";

const SubjectRow = ({ label, score, total, color }: { label: string, score: number, total: number, color: string }) => (
  <div className="group mb-3 last:mb-0">
    <div className="flex justify-between items-end mb-1.5">
      <span className="text-[12px] text-[var(--dashboard-secondary-text-color)] font-medium group-hover:text-white transition-colors uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[16px] font-bold text-white">{score}</span>
        <span className="text-[10px] text-[var(--dashboard-secondary-text-color)]">/{total}</span>
      </div>
    </div>
    <div className="w-full h-[6px] bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${(score / total) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const ScoreCard = () => {
  const { meta, subjects } = SINGLE_TEST_DATA;

  return (
    <AnalyticsCard title="Overall Score" className="h-full relative overflow-hidden bg-[#211f1c] border-[var(--dashboard-sidebar-border-color)]">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 p-32 bg-[var(--dashboard-core-color)] blur-[120px] opacity-[0.03] pointer-events-none" />
       
      <div className="flex flex-col md:flex-row items-center gap-6 h-full relative z-10 px-2">
        
        {/* Left: Big Score Display */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative">
             <div className="text-[64px] font-bold text-white leading-[0.9] tracking-tighter">
              {meta.myScore}
             </div>
             <p className="text-[12px] text-[var(--dashboard-secondary-text-color)] mt-2 font-medium">
               OUT OF {meta.totalMarks}
             </p>
          </div>
        </div>

        {/* Divider (Hidden on mobile) */}
        <div className="hidden md:block w-[1px] h-24 bg-[var(--dashboard-dividerline-color)] opacity-50"></div>

        {/* Right: Subject Split */}
        <div className="flex-1 w-full flex flex-col justify-center gap-1">
          <SubjectRow 
            label="Mathematics" 
            score={subjects.maths.score} 
            total={subjects.maths.total} 
            color="#FB7185" 
          />
          <SubjectRow 
            label="Physics" 
            score={subjects.physics.score} 
            total={subjects.physics.total} 
            color="#60A5FA" 
          />
          <SubjectRow 
            label="Chemistry" 
            score={subjects.chemistry.score} 
            total={subjects.chemistry.total} 
            color="#34D399" 
          />
        </div>
      </div>
    </AnalyticsCard>
  );
};