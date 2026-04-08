"use client";

import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import styles from "./PercentileCard.module.css";

interface Props {
  myScore: number;
  examType?: "MAIN" | "ADVANCED"; // Passed from the transformer meta
  userCategory?: string; // Optional: Pass this from your global Auth Store if available
}

export const PercentileCard = ({ myScore, examType = "MAIN", userCategory = "General" }: Props) => {
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
          // Send the unified payload to your newly updated proxy route
          body: JSON.stringify({
            score: myScore,
            year: 2025, 
            category: userCategory,
            examType: examType
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch prediction");

        const data = await res.json();
        
        if (isAdvanced) {
          // Parse specific response for JEE Advanced Rank
          const rank = data.estimated_rank ?? data.estimated_category_rank;
          if (rank) {
            // Formats numbers like 19501 to "19,501"
            setPredictionValue(rank.toLocaleString("en-IN"));
          } else {
            setPredictionValue("N/A");
          }
        } else {
          // Parse specific response for JEE Main Percentile
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
    <div className={styles.container}>
      
      <div className={styles.bgGradient} />
      <div className={styles.bgGlowAnimated} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            {/* Dynamic Icon based on exam */}
            {isAdvanced ? <FiAward size={16} /> : <FiTrendingUp size={16} />}
          </div>
          <span className={styles.headerTitle}>
            {/* Dynamic Title */}
            {isAdvanced ? "Predicted Rank" : "Predicted Percentile"}
          </span>
        </div>

        <div className={styles.mainContent}>
          
          <div className={styles.valueWrapper}>
            {isLoading ? (
              <div className={styles.loadingWrapper}>
                <span className={styles.loader}></span>
                <span className={styles.loadingText}>Calculating...</span>
              </div>
            ) : error ? (
              <div className={styles.errorText}>{error}</div>
            ) : (
              <div className={styles.percentileValue}>
                {isAdvanced && <span className={styles.percentileSymbol}># </span>}
                {predictionValue}
                {!isAdvanced && <span className={styles.percentileSymbol}> %ile</span>}
              </div>
            )}
          </div>

          <div className={styles.disclaimer}>
            <div className={styles.disclaimerDot} />
            <p className={styles.disclaimerText}>
              {isAdvanced 
                ? "Estimated category rank based on historical cutoffs." 
                : "Estimated based on paper difficulty and historical cutoff data."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};