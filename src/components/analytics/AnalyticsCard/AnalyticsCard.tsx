import React from "react";
import styles from "./AnalyticsCard.module.css";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  children,
  headerAction,
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
        {headerAction && <div className={styles.actionSlot}>{headerAction}</div>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
