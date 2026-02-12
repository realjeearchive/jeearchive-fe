import React from "react";
import styles from "./SolutionLayout.module.css";

interface SolutionLayoutProps {
  header: React.ReactNode; 
  sidebar: React.ReactNode; 
  footer?: React.ReactNode;
  children: React.ReactNode;
  
  isSidebarOpen: boolean; 
  onCloseSidebar?: () => void; // Used for clicking backdrop
}

export const SolutionLayout = ({ 
  header, 
  sidebar, 
  footer, 
  children,
  isSidebarOpen,
  onCloseSidebar
}: SolutionLayoutProps) => {

  return (
    <div className={styles.container}>
      
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        {header}
        <main className={styles.contentScrollArea}>
          {children}
        </main>
        {footer && (
          <div className={styles.footerArea}>
            {footer}
          </div>
        )}
      </div>

      {/* BACKDROP (Only visible on mobile when open) */}
      <div 
        className={`${styles.backdrop} ${isSidebarOpen ? styles.active : ''}`}
        onClick={onCloseSidebar} 
      />

      {/* Right Panel (Sidebar) */}
      <aside 
        className={`
          ${styles.rightPanel} 
          ${isSidebarOpen ? styles.mobileOpen : styles.closed}
        `}
      >
        <div className={styles.sidebarInner}>
          {sidebar}
        </div>
      </aside>

    </div>
  );
};