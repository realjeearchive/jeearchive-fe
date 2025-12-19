import React from "react";
import styles from "./KpiCard.module.css";

interface KpiCardProps {
  label: string;
  value: string;
  subLabel?: string;
  icon?: React.ReactNode;
  deltaLabel?: string;        // "+24%" / "-15%"
  tone?: string; // choose color set
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subLabel,
  icon,
  deltaLabel,
  tone = "mint",
}) => {
  return (
    <div className={`${styles.card} ${styles[`card_${tone}`]}`}>
      <div className={styles.headerRow}>
        <div className={styles.iconBox}>
          {icon ?? <span className={styles.iconPlaceholder} />}
        </div>
        {deltaLabel && (
          <div className={styles.deltaPill}>
            <span>{deltaLabel}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
      </div>
    </div>
  );
};

export default KpiCard;
