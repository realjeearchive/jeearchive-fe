"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import styles from "./PercentileCard.module.css";
// 🔥 FIX: Imported AnalyticsDataPayload to replace the 'any' type
import { useAnalyticsStore, AllTestDetail, AnalyticsDataPayload } from "@/store/useAnalyticsStore";

interface Props {
  myScore: number;
  examType?: "MAIN" | "ADVANCED";
  userCategory?: string;
}

// 🔥 FIX: Replaced 'any' with 'AnalyticsDataPayload | null'
const findTestById = (
  rawAnalytics: AnalyticsDataPayload | null,
  testId: string
): AllTestDetail | null => {
  if (!rawAnalytics || !testId) return null;

  if (rawAnalytics.overall?.allTests) {
    const found = rawAnalytics.overall.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }
  if (rawAnalytics.jeeMain?.allTests) {
    const found = rawAnalytics.jeeMain.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }
  if (rawAnalytics.jeeAdvanced?.allTests) {
    const found = rawAnalytics.jeeAdvanced.allTests.find((t: AllTestDetail) => t.id === testId);
    if (found) return found;
  }

  return null;
};

export const PercentileCard = ({
  myScore,
  examType: explicitExamType,
  userCategory = "General",
}: Props) => {
  const params = useParams();
  const { rawAnalytics } = useAnalyticsStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [predictionValue, setPredictionValue] = useState<string>("0");
  const [error, setError] = useState("");

  const currentExamType = useMemo(() => {
    if (explicitExamType) return explicitExamType;
    
    const testId = params?.testId as string;
    if (testId && rawAnalytics) {
      const currentTest = findTestById(rawAnalytics, testId);
      if (currentTest?.exam === "JEE_ADVANCED") {
        return "ADVANCED";
      }
    }
    return "MAIN";
  }, [explicitExamType, params?.testId, rawAnalytics]);

  const isAdvanced = currentExamType === "ADVANCED";

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (isAdvanced) {
          const res = await fetch("https://my.newtonschool.co/rank-predictor/api/predict-jee-advanced-rank/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category: userCategory,
              jee_advanced_score: myScore,
            }),
          });

          if (!res.ok) throw new Error("Failed to fetch advanced rank prediction");

          const data = await res.json();
          
          const rank = data.estimated_rank ?? data.estimated_category_rank;
          
          if (rank) {
            setPredictionValue(rank.toLocaleString("en-IN"));
          } else if (data.start_rank && data.end_rank) {
            // Formats it nicely as "25,001 - 25,946"
            setPredictionValue(`${data.start_rank.toLocaleString("en-IN")} - ${data.end_rank.toLocaleString("en-IN")}`);
          } else {
            setPredictionValue("N/A");
          }
        } else {
          const res = await fetch("/api/percentile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              score: myScore,
              year: 2025,
              category: userCategory,
              examType: currentExamType,
            }),
          });

          if (!res.ok) throw new Error("Failed to fetch percentile prediction");

          const data = await res.json();
          const pct = data.estimated_percentile;
          
          if (pct && !isNaN(pct)) {
            setPredictionValue(parseFloat(pct).toFixed(2));
          } else {
            setPredictionValue("N/A");
          }
        }
      } catch (err) {
        setError("Prediction unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [myScore, currentExamType, userCategory, isAdvanced]);

  return (
    <section className={styles.container} aria-label={isAdvanced ? "Predicted rank" : "Predicted percentile"}>
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgGlowAnimated} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox} aria-hidden="true">
            {isAdvanced ? <FiAward size={16} /> : <FiTrendingUp size={16} />}
          </div>
          <span className={styles.headerTitle}>
            {isAdvanced ? "Predicted Rank" : "Predicted Percentile"}
          </span>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.valueWrapper}>
            {isLoading ? (
              <div className={styles.loadingWrapper} role="status" aria-label="Calculating prediction">
                <span className={styles.loader} aria-hidden="true"></span>
                <span className={styles.loadingText}>Calculating...</span>
              </div>
            ) : error ? (
              <div className={styles.errorText} role="alert">{error}</div>
            ) : (
              <div className={styles.percentileValue}>
                {isAdvanced && predictionValue !== "N/A" && (
                  <span className={styles.percentileSymbol}># </span>
                )}
                {predictionValue}
                {!isAdvanced && predictionValue !== "N/A" && (
                  <span className={styles.percentileSymbol}> %ile</span>
                )}
              </div>
            )}
          </div>

          <div className={styles.disclaimer}>
            <div className={styles.disclaimerDot} aria-hidden="true" />
            <p className={styles.disclaimerText}>
              {isAdvanced
                ? "Estimated category rank based on historical cutoffs."
                : "Estimated based on paper difficulty and historical cutoff data."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};