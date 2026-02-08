"use client";

import React, { use } from "react";
import { AnalysisLayout } from "@/components/analytics/TestAnalysis/AnalysisLayout";
import { SINGLE_TEST_DATA } from "@/features/analytics/dummyData";
import { FiDownload, FiBookOpen } from "react-icons/fi";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export default function SingleTestAnalysisPage(props: PageProps) {
  const { testId } = use(props.params);

  return (
    <div className=" max-w-[1600px] mx-auto min-h-screen">
      
      {/* HEADER ROW */}
      <div className="flex flex-col gap-4 mb-6">

        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Test Info */}
          <div>
            <h1 className="text-xl font-bold text-[var(--dashboard-primary-text-color)] leading-tight">
              {SINGLE_TEST_DATA.meta.testName}
            </h1>
            <p className="text-xs text-[var(--dashboard-secondary-text-color)] mt-1 flex items-center gap-2">
              <span>{SINGLE_TEST_DATA.meta.date}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--dashboard-icons-color)]"></span>
              <span>Full Test</span>
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--dashboard-sidebar-border-color)] text-[var(--dashboard-secondary-text-color)] hover:text-[var(--dashboard-primary-text-color)] hover:bg-[rgba(255,255,255,0.03)] transition-all text-xs font-medium">
              <FiDownload size={14} /> Report
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--dashboard-core-color) text-black hover:opacity-90 transition-opacity text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <FiBookOpen size={14} /> View Solutions
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <AnalysisLayout />
    </div>
  );
}