"use client";

import React, { useState } from "react";
import { FiGrid, FiLayers, FiClock, FiList } from "react-icons/fi";
import dynamic from "next/dynamic";

const OverviewTab = dynamic(() => import("./Overview/OverviewTab/OverviewTab").then(mod => mod.OverviewTab));
const PerformanceTab = dynamic(() => import("./Performance/PerformanceTab/PerformanceTab").then(mod => mod.PerformanceTab));
const TimeAnalysisTab = dynamic(() => import("./TimeAnalysis/TimeAnalysisTab/TimeAnalysisTab").then(mod => mod.TimeAnalysisTab));
const QuestionWiseTab = dynamic(() => import("./QuestionWise/QuestionWiseTab").then(mod => mod.QuestionWiseTab));
import styles from "./AnalysisLayout.module.css";

const MENU_ITEMS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "performance", label: "Performance", icon: FiLayers },
  { id: "time_behavior", label: "Time Analysis", icon: FiClock },
  { id: "questions", label: "Question Wise", icon: FiList },
];

export const AnalysisLayout = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;

      case "performance":
        return <PerformanceTab />;

      case "time_behavior":
        return <TimeAnalysisTab />;

      case "questions":
        return <QuestionWiseTab />;

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navWrapper}>
        <nav className={styles.nav} role="tablist" aria-label="Analysis sections">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                role="tab"
                aria-selected={isActive}
                className={`${styles.navButton} ${isActive ? styles.navButtonActive : styles.navButtonInactive}`}
              >
                <item.icon
                  size={14}
                  className={isActive ? styles.iconActive : styles.iconInactive}
                  aria-hidden="true"
                />
                {item.label}

                {isActive && (
                  <span className={styles.activeIndicator} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <main className={styles.content}>{renderContent()}</main>
    </div>
  );
};