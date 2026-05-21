import React from "react";
import styles from "./AnalyticsCard.module.css";

interface AnalyticsCardProps {
  title?: string; // Made optional so we can have clean chart-only cards
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  transparent?: boolean; // NEW: Allows the card to blend into the background
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  children,
  headerAction,
  className,
  style,
  transparent = false,
}) => {
  return (
    <div 
      className={`${styles.card} ${transparent ? styles.transparentCard : ''} ${className || ""}`} 
      style={style}
    >
      {(title || headerAction) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && <div className={styles.actionSlot}>{headerAction}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};