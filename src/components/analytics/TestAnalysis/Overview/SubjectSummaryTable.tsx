"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { OVERVIEW_COMPARISON } from "@/features/analytics/dummyData";

export const SubjectSummaryTable = () => {
  return (
    <AnalyticsCard title="Subject Performance" className="h-full bg-[#211f1c]">
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase text-[var(--dashboard-secondary-text-color)] tracking-wider border-b border-[var(--dashboard-dividerline-color)]">
              <th className="py-3 font-semibold pl-2">Subject</th>
              <th className="py-3 font-semibold text-right">Score</th>
              <th className="py-3 font-semibold text-right">Attempts</th>
              <th className="py-3 font-semibold text-right hidden sm:table-cell">Accuracy</th>
              <th className="py-3 font-semibold text-right pr-2 hidden sm:table-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            {OVERVIEW_COMPARISON.subjects.map((sub) => {
               const color = 
               sub.name === "Physics" ? "#60A5FA" :
               sub.name === "Chemistry" ? "#34D399" : "#FB7185";

              return (
                <tr key={sub.name} className="group border-b border-[rgba(255,255,255,0.02)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full opacity-80" style={{ backgroundColor: color }}></div>
                      <span className="font-medium text-[var(--dashboard-primary-text-color)] text-[14px]">
                        {sub.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-bold text-[14px] text-white">{sub.score}</span>
                    <span className="text-[11px] text-[var(--dashboard-secondary-text-color)]">/{sub.total}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] text-[var(--dashboard-primary-text-color)]">{sub.attempted}</span>
                      <span className="text-[9px] text-[var(--dashboard-secondary-text-color)]">Questions</span>
                    </div>
                  </td>
                  <td className="py-3 text-right hidden sm:table-cell">
                    <span className={`font-bold text-[13px] ${sub.accuracy > 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                      {sub.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right hidden sm:table-cell">
                    <span className="text-[13px] font-medium text-[var(--dashboard-secondary-text-color)]">{sub.time}m</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  );
};