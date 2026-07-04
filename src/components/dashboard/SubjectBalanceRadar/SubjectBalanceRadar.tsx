"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { dashboardNivoTheme } from "@/theme/nivoTheme";
import styles from "./SubjectBalanceRadar.module.css";
import { FiCrosshair } from "react-icons/fi";

interface SubjectBalanceBarProps {
  data: Array<{ subject: string; Accuracy: number; attempts?: number }>;
}

const SubjectBalanceBar: React.FC<SubjectBalanceBarProps> = ({ data }) => {
  const hasData = data && data.some((item) => (item.attempts ?? 0) > 0 || item.Accuracy !== 0);

  return (
    <section className={styles.card} aria-label="Subject balance chart">
      <h3 className={styles.title}>Subject Balance</h3>
      <p className={styles.subtitle}>
        Accuracy distribution (Positive vs Negative).
      </p>

      <div className={styles.chartWrapper}>
        {hasData ? (
          <ResponsiveBar
            data={data}
            keys={["Accuracy"]}
            indexBy="subject"
            theme={dashboardNivoTheme}
            margin={{ top: 10, right: 20, bottom: 40, left: 85 }}
            padding={0.35}
            layout="horizontal"
            valueScale={{ type: "linear", min: "auto", max: 100 }}
            indexScale={{ type: "band", round: true }}

            colors={({ data: d }) => {
              if (d.Accuracy > 0) return "#10b981";
              if (d.Accuracy < 0) return "#ef4444";
              return "#27272a";
            }}

            enableGridX={true}
            enableGridY={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 0,
              format: (val) => `${val}%`,
              tickValues: 5,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}

            label={(d) => `${d.value}%`}
            labelTextColor="#ffffff"
            labelSkipWidth={40}

            markers={[
              {
                axis: "x",
                value: 0,
                lineStyle: {
                  stroke: "rgba(255, 255, 255, 0.4)",
                  strokeWidth: 2,
                },
              },
            ]}

            isInteractive={true}
            tooltip={({ value, indexValue }) => (
              <div className={styles.tooltip}>
                <strong>{indexValue}</strong>:
                <span
                  style={{
                    color: Number(value) < 0 ? "#ef4444" : "#10b981",
                    marginLeft: "6px",
                  }}
                >
                  {value}%
                </span>
              </div>
            )}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.blurredPlaceholder} aria-hidden="true">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="90" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="90" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="90" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="10" y1="70" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="10" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            <div className={styles.emptyOverlay}>
              <div className={styles.emptyIconBox} aria-hidden="true">
                <FiCrosshair size={24} />
              </div>
              <p className={styles.emptyText}>Unlock Subject Balance</p>
              <span className={styles.emptySubText}>
                Complete your first mock test to see your accuracy distribution
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubjectBalanceBar;