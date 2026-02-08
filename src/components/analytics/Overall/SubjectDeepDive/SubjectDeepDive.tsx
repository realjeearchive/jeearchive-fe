"use client";

import React from "react";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { SUBJECT_DEEP_DIVE } from "@/features/analytics/dummyData";
import { FiClock, FiAlertTriangle } from "react-icons/fi";

export const SubjectDeepDive = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
      {SUBJECT_DEEP_DIVE.map((sub) => {
        // Match dashboard subject colors
        const color = 
          sub.subject === "Physics" ? "#60A5FA" : // Blue-ish
          sub.subject === "Chemistry" ? "#34D399" : // Green-ish
          "#FB7185"; // Red/Pink-ish

        return (
          <AnalyticsCard key={sub.subject} title={sub.subject} className="min-h-[160px]">
             {/* Content Layout */}
            <div className="flex flex-col justify-between h-full gap-4">
              
              {/* Top Row: Score & Accuracy */}
              <div className="flex items-start justify-between">
                <div>
                   <div className="flex items-baseline gap-1">
                    <span className="text-[var(--dashboard-font-xl, 32px)] font-bold text-white leading-none">
                      {sub.avgScore}
                    </span>
                    <span className="text-[var(--dashboard-font-xs, 12px)] text-[var(--dashboard-secondary-text-color)]">
                      /100
                    </span>
                   </div>
                   <p className="text-[var(--dashboard-font-xs, 12px)] text-[var(--dashboard-secondary-text-color)] uppercase tracking-wider mt-1">
                     Avg Score
                   </p>
                </div>

                {/* Accuracy Circular/Text */}
                <div className="text-right">
                  <div className="text-[var(--dashboard-font-lg, 18px)] font-bold" style={{ color }}>
                    {sub.accuracy}%
                  </div>
                  <p className="text-[10px] text-[var(--dashboard-secondary-text-color)] uppercase">
                    Accuracy
                  </p>
                </div>
              </div>

              {/* Bottom Row: Negatives & Time */}
              <div className="flex items-center gap-3 mt-auto">
                {/* Negatives Pill (using dashboard deltaNegative style) */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                  <FiAlertTriangle size={12} className="text-red-500" />
                  <span className="text-[11px] font-medium text-red-400">-{sub.negatives}</span>
                </div>

                {/* Time Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                  <FiClock size={12} className="text-[var(--dashboard-secondary-text-color)]" />
                  <span className="text-[11px] font-medium text-[var(--dashboard-primary-text-color)]">{sub.avgTime}m</span>
                </div>
              </div>

            </div>
          </AnalyticsCard>
        );
      })}
    </div>
  );
};