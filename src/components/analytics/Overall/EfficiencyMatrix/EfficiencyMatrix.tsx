"use client";

import React, { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import { AnalyticsCard } from "../../AnalyticsCard/AnalyticsCard";
import { FiZap } from "react-icons/fi";
import styles from "./EfficiencyMatrix.module.css";

interface QuestionTypeEfficiency {
  type: string;
  accuracy: number;
  color: string;
}

interface EfficiencyData {
  questionTypes: QuestionTypeEfficiency[];
  leakage: number;
  momentum: number;
}

interface EfficiencyMatrixProps {
  data: EfficiencyData;
}

const getShortLabel = (type: string): string => {
  const map: Record<string, string> = {
    "Single Correct": "MCQ",
    "Multiple Correct": "Multi MCQ",
    "Numerical": "Numerical",
    "Integer": "Numerical",
    "Comprehension SCQ": "Comp MCQ",
    "Comprehension MCQ": "Comp Multi",
    "Comprehension Num": "Comp Num",
  };
  return map[type] || type;
};

export const EfficiencyMatrix: React.FC<EfficiencyMatrixProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  const isZero = useMemo(() => {
    return data.questionTypes.every(qt => qt.accuracy === 0);
  }, [data.questionTypes]);

  const activeTypes = useMemo(() => {
    return data.questionTypes.filter(qt => qt.accuracy > 0);
  }, [data.questionTypes]);

  useEffect(() => {
    if (!chartRef.current || isZero || activeTypes.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    const chartData = activeTypes.map(qt => ({
      value: qt.accuracy,
      name: getShortLabel(qt.type),
      itemStyle: {
        color: qt.color,
      },
    }));

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
          fontSize: 10,
        },
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 16,
      },
      series: [
        {
          name: "Accuracy",
          type: "pie",
          radius: activeTypes.length > 3 ? ["25%", "65%"] : ["30%", "70%"],
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
              fontSize: 11,
              fontWeight: "bold",
              color: "#fff",
            },
          },
          data: chartData,
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
  }, [activeTypes, isZero]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <AnalyticsCard title="Format Efficiency" subtitle="Accuracy by question type">
      <div className={styles.container}>
        {isZero || activeTypes.length === 0 ? (
          <div className={styles.emptyState}>
            <FiZap size={20} className={styles.emptyIcon} />
            <span>Not enough data yet</span>
          </div>
        ) : (
          <div ref={chartRef} className={styles.chartArea} />
        )}
      </div>
    </AnalyticsCard>
  );
};