"use client";

import React from "react";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiTrendingUp } from "react-icons/fi";

export const PercentileCard = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--dashboard-sidebar-border-color)] bg-gradient-to-br from-[#1E1D1B] to-[#252422] p-6 h-full flex flex-col justify-between group">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--dashboard-highlight-color)] blur-[80px] opacity-10 rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />

      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded bg-[rgba(133,219,251,0.1)] text-[var(--dashboard-highlight-color)]">
          <FiTrendingUp size={18} />
        </div>
        <span className="text-sm font-bold text-[var(--dashboard-highlight-color)] uppercase tracking-wider">
          Predicted Percentile
        </span>
      </div>

      <div>
        <div className="text-5xl font-black text-white tracking-tight">
          {SINGLE_TEST_DATA.meta.predictedPercentile}
        </div>
        <p className="text-xs text-[var(--dashboard-secondary-text-color)] mt-2 leading-relaxed">
          Based on the difficulty level of this specific shift (27 Jan S1) and historical cutoffs.
        </p>
      </div>
    </div>
  );
};