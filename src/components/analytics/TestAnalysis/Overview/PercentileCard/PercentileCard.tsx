"use client";

import React, { useState, useEffect } from "react";
import { FiTrendingUp } from "react-icons/fi";
import styles from "./PercentileCard.module.css";

interface Props {
  myScore: number;
}

export const PercentileCard = ({ myScore }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [predictedPercentile, setPredictedPercentile] = useState<string>("0.00");
  const [error, setError] = useState("");

  // 🚨 NEW: Auto-fetch the percentile as soon as the component loads
  useEffect(() => {
    const fetchPercentile = async () => {
      try {
        const res = await fetch("/api/percentile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ marks: myScore }),
        });

        if (!res.ok) throw new Error("Failed to fetch percentile");

        const data = await res.json();
        
        let finalPercentile = 0;
        
        if (data.percentile_best && data.percentile_worst) {
           finalPercentile = (data.percentile_best + data.percentile_worst) / 2;
        } else {
           const val = data.percentile_best || data.percentile || data.predictedPercentile || data.data || data;
           if (typeof val === 'number') finalPercentile = val;
           else if (typeof val === 'string') finalPercentile = parseFloat(val);
           else if (val && typeof val === 'object') {
              const nestedVal = val.percentile || val.value || "0";
              finalPercentile = parseFloat(nestedVal);
           }
        }

        const parsedVal = isNaN(finalPercentile) ? "N/A" : finalPercentile.toFixed(2);

        setPredictedPercentile(parsedVal);
      } catch (err) {
        setError("Prediction unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPercentile();
  }, [myScore]);

  return (
    <div className={styles.container}>
      
      <div className={styles.bgGradient} />
      <div className={styles.bgGlowAnimated} />

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <FiTrendingUp size={16} />
          </div>
          <span className={styles.headerTitle}>
            Predicted Percentile
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
                {predictedPercentile} <span className={styles.percentileSymbol}>%ile</span>
              </div>
            )}
          </div>

          <div className={styles.disclaimer}>
            <div className={styles.disclaimerDot} />
            <p className={styles.disclaimerText}>
              Estimated based on paper difficulty and historical cutoff data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};