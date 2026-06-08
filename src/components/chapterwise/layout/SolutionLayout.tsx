import React from "react";
import styles from "./SolutionLayout.module.css";

interface SolutionLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onCloseSidebar?: () => void;
}

export const SolutionLayout = ({
  header,
  sidebar,
  footer,
  children,
  isSidebarOpen,
  onCloseSidebar,
}: SolutionLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {header}
        <main className={styles.contentScrollArea} id="practice-main-content">
          {children}
        </main>
        {footer && (
          <footer className={styles.footerArea}>
            {footer}
          </footer>
        )}
      </div>

      <div
        className={`${styles.backdrop} ${isSidebarOpen ? styles.active : ""}`}
        onClick={onCloseSidebar}
        role="presentation"
        aria-hidden={!isSidebarOpen}
      />

      <aside
        className={`
          ${styles.rightPanel} 
          ${isSidebarOpen ? styles.mobileOpen : styles.closed}
        `}
        aria-label="Question navigation panel"
        aria-hidden={!isSidebarOpen}
      >
        <div className={styles.sidebarInner}>{sidebar}</div>
      </aside>
    </div>
  );
};