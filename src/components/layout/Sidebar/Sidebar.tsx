"use client";

import React from "react";
import styles from "./Sidebar.module.css";
import { PiSidebar } from "react-icons/pi";

export interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  return (
    <aside className={styles.sidebar}>
      <button onClick={()=>toggleSidebar()} className={styles.sidebarIcon}>
        <PiSidebar size={22} />
      </button>

      {/* Empty sidebar content */}
    </aside>
  );
};

export default Sidebar;
