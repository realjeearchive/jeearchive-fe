import React from "react";
import styles from "./SolutionLayout.module.css";

interface SolutionLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  footer?: React.ReactNode; // New Prop
  children: React.ReactNode;
}

export const SolutionLayout = ({ header, sidebar, footer, children }: SolutionLayoutProps) => {
  return (
    <div className={styles.container}>
      
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        {/* Fixed Header */}
        {header}

        {/* Scrollable Content */}
        <main className={styles.contentScrollArea}>
          {children}
        </main>

        {/* Fixed Footer */}
        {footer && (
          <div className={styles.footerArea}>
            {footer}
          </div>
        )}
      </div>

      {/* Right Panel (Sidebar) */}
      <aside className={styles.rightPanel}>
        {sidebar}
      </aside>

    </div>
  );
};