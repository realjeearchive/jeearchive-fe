"use client";

import React, { useState } from "react";
import { 
  FiGrid, FiLayers, FiClock, FiList, FiTarget 
} from "react-icons/fi";
import { OverviewTab } from "./Overview/OverviewTab";

const MENU_ITEMS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "performance", label: "Performance", icon: FiLayers },
  { id: "time_behavior", label: "Time Analysis", icon: FiClock },
  { id: "questions", label: "Question Wise", icon: FiList },
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
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[var(--dashboard-sidebar-border-color)] rounded-[10px] bg-[#211f1c]">
             <div className="text-4xl mb-4 grayscale opacity-30">🚧</div>
             <h3 className="text-sm font-bold text-[var(--dashboard-secondary-text-color)]">
               {MENU_ITEMS.find(i => i.id === activeTab)?.label} Analysis
             </h3>
             <p className="text-xs text-[var(--dashboard-secondary-text-color)] mt-1">
               Detailed analytics coming in the next update.
             </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. STICKY HEADER NAVIGATION */}
      <div className="sticky top-0 z-20 bg-[var(--dashboard-background-color)]/95 backdrop-blur-md border-b border-[var(--dashboard-dividerline-color)] -mx-4 px-4">
        <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  group relative flex items-center gap-2 py-3 text-[13px] font-medium whitespace-nowrap transition-colors duration-200
                  ${isActive 
                    ? "text-[#F59E0B]" 
                    : "text-[var(--dashboard-secondary-text-color)] hover:text-[var(--dashboard-primary-text-color)]"
                  }
                `}
              >
                <item.icon size={14} className={isActive ? "text-[#F59E0B]" : "text-[var(--dashboard-secondary-text-color)] group-hover:text-[var(--dashboard-primary-text-color)]"} />
                {item.label}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F59E0B] shadow-[0_-1px_6px_rgba(245,158,11,0.4)]" />
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