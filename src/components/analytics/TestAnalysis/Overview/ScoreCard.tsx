"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";

// FIX: Defined outside the main component
const SubjectRow = ({ label, score, total, color }: { label: string, score: number, total: number, color: string }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-[var(--dashboard-secondary-text-color)] font-medium">{label}</span>
      <span className="font-bold text-[var(--dashboard-primary-text-color)]">
        {score} <span className="text-[10px] text-[var(--dashboard-secondary-text-color)] font-normal">/ {total}</span>
      </span>
    </div>
    <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full" 
        style={{ width: `${(score / total) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const ScoreCard = () => {
  const { meta, subjects } = SINGLE_TEST_DATA;

  return (
    <AnalyticsCard title="Overall Score" className="h-full">
      <div className="flex flex-col md:flex-row items-center gap-8 h-full">
        
        {/* Left: Big Score */}
        <div className="flex-1 flex flex-col items-center justify-center text-center border-r border-[var(--dashboard-dividerline-color)] pr-8 w-full md:w-auto border-b md:border-b-0 pb-6 md:pb-0">
          <div className="text-6xl font-black text-[var(--dashboard-primary-text-color)] tracking-tighter">
            {meta.myScore}
          </div>
          <div className="text-sm font-medium text-[var(--dashboard-secondary-text-color)] mt-1 uppercase tracking-widest">
            out of {meta.totalMarks}
          </div>
        </div>

        {/* Right: Subject Split */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <SubjectRow 
            label="Mathematics" 
            score={subjects.maths.score} 
            total={subjects.maths.total} 
            color="var(--dashboard-maths-color)" 
          />
          <SubjectRow 
            label="Physics" 
            score={subjects.physics.score} 
            total={subjects.physics.total} 
            color="var(--dashboard-physics-color)" 
          />
          <SubjectRow 
            label="Chemistry" 
            score={subjects.chemistry.score} 
            total={subjects.chemistry.total} 
            color="var(--dashboard-chemistry-color)" 
          />
        </div>
      </div>
    </AnalyticsCard>
  );
};