"use client";

import React from "react";
import styles from "./KpiCard.module.css";
import { FiMinus } from "react-icons/fi";

interface KpiCardProps {
  label: string;
  value: string;
  subLabel?: string;
  icon?: React.ReactNode;
  deltaLabel?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subLabel,
  icon,
  deltaLabel,
}) => {
  // Determine if we have a valid delta to show
  const hasDelta = deltaLabel && deltaLabel.trim() !== "";
  
  // Determine Delta Style
  const getDeltaClass = () => {
    if (!hasDelta) return "";
    const txt = deltaLabel.trim();
    if (txt.startsWith("+") || txt.toLowerCase().includes("top")) return styles.deltaPositive;
    if (txt.startsWith("-")) return styles.deltaNegative;
    return styles.deltaNeutral;
  };

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          {icon ?? <span className={styles.iconPlaceholder} />}
        </div>

        {hasDelta && (
          <div className={`${styles.deltaPill} ${getDeltaClass()}`}>
            <span>{deltaLabel}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        
        {/* Value with specific styling for "0" or empty states could go here if needed */}
        <span className={styles.value}>{value}</span>
        
        {subLabel ? (
          <span className={styles.subLabel}>{subLabel}</span>
        ) : (
          /* Placeholder if no sub-label provided */
          <span className={styles.subLabelEmpty}>&nbsp;</span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;