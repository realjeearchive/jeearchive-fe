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
  const hasDelta = deltaLabel && deltaLabel.trim() !== "";

  const getDeltaClass = () => {
    if (!hasDelta) return "";
    const txt = deltaLabel.trim();
    if (txt.startsWith("+") || txt.toLowerCase().includes("top"))
      return styles.deltaPositive;
    if (txt.startsWith("-")) return styles.deltaNegative;
    return styles.deltaNeutral;
  };

  return (
    <article className={styles.card} aria-label={`${label}: ${value}`}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox} aria-hidden="true">
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

        <span className={styles.value}>{value}</span>

        {subLabel ? (
          <span className={styles.subLabel}>{subLabel}</span>
        ) : (
          <span className={styles.subLabelEmpty}>&nbsp;</span>
        )}
      </div>
    </article>
  );
};

export default KpiCard;