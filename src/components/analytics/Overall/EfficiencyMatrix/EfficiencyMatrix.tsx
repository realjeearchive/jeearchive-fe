"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiZap, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import styles from "./EfficiencyMatrix.module.css";

interface EfficiencyData {
  mcqAcc: number;
  numAcc: number;
  leakage: number;
  momentum: number;
}

interface EfficiencyMatrixProps {
  data: EfficiencyData;
}

export const EfficiencyMatrix: React.FC<EfficiencyMatrixProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const isZero = data.mcqAcc === 0 && data.numAcc === 0;

  useEffect(() => {
    if (!chartRef.current || isZero) return;

    // Dispose previous instance if it exists
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#1a1917",
        borderColor: "rgba(255,255,255,0.1)",
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number };
          return `<strong>${p.name}</strong><br/>Accuracy: ${p.value}%`;
        },
      },
      legend: {
        bottom: 0,
        textStyle: {
          color: "rgba(255,255,255,0.5)",
          fontSize: 11,
        },
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 20,
      },
      series: [
        {
          name: "Accuracy",
          type: "pie",
          radius: ["25%", "60%"],
          center: ["50%", "45%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 4,
            borderColor: "#1a1917",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            scaleSize: 6,
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
              color: "#fff",
            },
          },
          data: [
            {
              value: data.mcqAcc,
              name: "MCQ",
              itemStyle: {
                color: "#F59E0B",
              },
            },
            {
              value: data.numAcc,
              name: "Numerical",
              itemStyle: {
                color: "#3B82F6",
              },
            },
          ],
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, isZero]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <AnalyticsCard title="Format Efficiency" subtitle="Accuracy by question type">
      <div className={styles.container}>
        {isZero ? (
          <div className={styles.emptyState}>
            <FiZap size={20} className={styles.emptyIcon} />
            <span>Not enough data yet</span>
          </div>
        ) : (
          <>
            {/* Nightingale / Rose Chart */}
            <div ref={chartRef} className={styles.chartArea} />

            {/* Leakage & Momentum */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statIcon} data-type="leakage">
                  <FiTrendingDown size={14} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Score Leakage</span>
                  <span className={styles.statValue}>-{data.leakage}</span>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.statItem}>
                <div className={styles.statIcon} data-type={data.momentum >= 0 ? "positive" : "negative"}>
                  <FiTrendingUp size={14} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Momentum</span>
                  <span className={`${styles.statValue} ${data.momentum >= 0 ? styles.positive : styles.negative}`}>
                    {data.momentum >= 0 ? "+" : ""}{data.momentum}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AnalyticsCard>
  );
};