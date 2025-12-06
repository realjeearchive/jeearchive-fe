// sidebar.tsx
import React from "react";
import styles from "./Sidebar.module.css";
import { PiSidebar } from "react-icons/pi";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.sidebarIcon}>
        <PiSidebar size={22} />
      </button>

      {/* Content area still empty */}
    </aside>
  );
};

export default Sidebar;
