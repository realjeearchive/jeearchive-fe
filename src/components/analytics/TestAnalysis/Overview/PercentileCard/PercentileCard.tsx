"use client";

import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import styles from "./PercentileCard.module.css";

interface Props {
  myScore: number;
  examType?: "MAIN" | "ADVANCED";
  userCategory?: string;
}

export const PercentileCard = ({
  myScore,
  examType = "MAIN",
  userCategory = "General",
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [predictionValue, setPredictionValue] = useState<string>("0");
  const [error, setError] = useState("");

  const isAdvanced = examType === "ADVANCED";

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch("/api/percentile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: myScore,
            year: 2025,
            category: userCategory,
            examType: examType,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch prediction");

        const data = await res.json();

        if (isAdvanced) {
          const rank = data.estimated_rank ?? data.estimated_category_rank;
          if (rank) {
            setPredictionValue(rank.toLocaleString("en-IN"));
          } else {
            setPredictionValue("N/A");
          }
        } else {
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
  }, [myScore, examType, userCategory, isAdvanced]);

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
                {isAdvanced && (
                  <span className={styles.percentileSymbol}># </span>
                )}
                {predictionValue}
                {!isAdvanced && (
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