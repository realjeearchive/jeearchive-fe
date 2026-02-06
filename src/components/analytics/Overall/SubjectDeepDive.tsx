"use client";

import React from "react";
import { AnalyticsCard } from "../AnalyticsCard/AnalyticsCard";
import { SUBJECT_DEEP_DIVE } from "@/features/analytics/dummyData";
import { FiClock, FiAlertCircle } from "react-icons/fi";

export const SubjectDeepDive = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {SUBJECT_DEEP_DIVE.map((sub) => {
        // Subject accent color
        const color = 
          sub.subject === "Physics" ? "var(--dashboard-physics-color)" :
          sub.subject === "Chemistry" ? "var(--dashboard-chemistry-color)" :
          "var(--dashboard-maths-color)";

        return (
          <AnalyticsCard key={sub.subject} title={sub.subject}>
            <div className="flex flex-col h-full justify-between">
              
              {/* Hero: Score */}
              <div className="flex items-baseline gap-2 mt-2 mb-6">
                <span className="text-4xl font-bold text-[var(--dashboard-primary-text-color)]">
                  {sub.avgScore}
                </span>
                <span className="text-sm text-[var(--dashboard-secondary-text-color)] font-medium">
                  / 100
                </span>
                <span className="ml-auto text-sm font-semibold" style={{ color: color }}>
                  {sub.accuracy}% Acc.
                </span>
              </div>

              {/* Secondary Stats - Clean Row */}
              <div className="flex items-center pt-4 border-t border-[var(--dashboard-dividerline-color)]">
                
                {/* Negatives */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-[var(--dashboard-secondary-text-color)] mb-1">
                    <FiAlertCircle size={14} />
                    <span className="text-xs uppercase tracking-wide">Negatives</span>
                  </div>
                  <div className="text-lg font-medium text-[var(--dashboard-negative-delta-color)]">
                    -{sub.negatives}
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-8 bg-[var(--dashboard-dividerline-color)] mx-4"></div>

                {/* Time */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-[var(--dashboard-secondary-text-color)] mb-1">
                    <FiClock size={14} />
                    <span className="text-xs uppercase tracking-wide">Avg Time</span>
                  </div>
                  <div className="text-lg font-medium text-[var(--dashboard-primary-text-color)]">
                    {sub.avgTime}m
                  </div>
                </div>

              </div>
            </div>
          </AnalyticsCard>
        );
      })}
    </div>
  );
};