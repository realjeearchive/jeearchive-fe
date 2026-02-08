"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiTrendingUp } from "react-icons/fi";

export const PercentileCard = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(245,158,11,0.2)] bg-[#1E1D1B] h-full flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      
      {/* Premium Amber Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,158,11,0.08)] to-transparent opacity-80" />
      <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-[var(--dashboard-core-color)] blur-[120px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700" />

      <div className="relative z-10 p-5 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[rgba(245,158,11,0.1)] text-[var(--dashboard-core-color)] border border-[rgba(245,158,11,0.1)]">
            <FiTrendingUp size={16} />
          </div>
          <span className="text-[10px] font-bold text-[var(--dashboard-core-color)] uppercase tracking-widest">
            Predicted Percentile
          </span>
        </div>

        <div className="mt-3">
          <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
            {SINGLE_TEST_DATA.meta.predictedPercentile}
          </div>
          <div className="mt-2 flex items-start gap-2">
            <div className="w-1 h-1 mt-1.5 rounded-full bg-[var(--dashboard-secondary-text-color)] flex-shrink-0" />
            <p className="text-[10px] text-[var(--dashboard-secondary-text-color)] leading-relaxed max-w-[95%]">
              Estimated based on shift difficulty (27 Jan S1) and historical cutoff data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};