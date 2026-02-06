"use client";

import React, { useState } from "react";
import { 
  FiGrid, FiBarChart2, FiActivity, FiClock, FiTarget, 
  FiTrendingUp, FiList 
} from "react-icons/fi";
import { OverviewTab } from "./Overview/OverviewTab";

const MENU_ITEMS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "performance", label: "Performance", icon: FiBarChart2 },
  { id: "score_potential", label: "Score Potential", icon: FiTrendingUp },
  { id: "attempt_quality", label: "Attempt Quality", icon: FiActivity },
  { id: "time_analysis", label: "Time Analysis", icon: FiClock },
  { id: "difficulty", label: "Difficulty", icon: FiTarget },
  { id: "question_analysis", label: "Qs Breakdown", icon: FiList },
];

export const AnalysisLayout = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Render Content Helper
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[var(--dashboard-dividerline-color)] rounded-xl bg-[rgba(255,255,255,0.01)]">
             <div className="text-4xl mb-4 grayscale opacity-50">🚧</div>
             <h3 className="text-lg font-bold text-[var(--dashboard-secondary-text-color)]">
               {MENU_ITEMS.find(i => i.id === activeTab)?.label}
             </h3>
             <p className="text-sm text-[var(--dashboard-icons-color)]">
               This analytics module is under construction.
             </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. STICKY HEADER NAVIGATION */}
      <div className="sticky top-0 z-20 bg-[var(--dashboard-background-color)]/95 backdrop-blur-md border-b border-[var(--dashboard-dividerline-color)] -mx-6 px-6 pt-2">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  group relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${isActive 
                    ? "text-[var(--dashboard-highlight-color)]" 
                    : "text-[var(--dashboard-secondary-text-color)] hover:text-[var(--dashboard-primary-text-color)]"
                  }
                `}
              >
                <item.icon size={16} className={isActive ? "text-[var(--dashboard-highlight-color)]" : "text-[var(--dashboard-icons-color)] group-hover:text-[var(--dashboard-primary-text-color)]"} />
                {item.label}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--dashboard-highlight-color)] rounded-t-full shadow-[0_-2px_10px_rgba(133,219,251,0.5)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <main className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()} 
      </main>

    </div>
  );
};