import React from "react";
import styles from "./AnalyticsCard.module.css";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode; // Optional button/dropdown top-right
  className?: string;
  style?: React.CSSProperties;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className,
  style,
}) => {
  return (
    <div className={`${styles.card} ${className || ""}`} style={style}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.actionSlot}>{action}</div>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};