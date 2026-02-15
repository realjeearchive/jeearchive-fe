"use client";

import React from "react";
import styles from "./ProfileContent.module.css";
import { FiCamera, FiEdit2 } from "react-icons/fi";

export default function ProfileContent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Account Settings</h1>

      {/* TOP SECTION */}
      <div className={styles.topSection}>
        
        {/* LEFT AVATAR CARD */}
        <div className={styles.avatarCard}>
          <div className={styles.avatar}>
            <span className={styles.avatarInitial}>A</span>
            <button className={styles.cameraBadge}>
              <FiCamera size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className={styles.infoWrapper}>
          
          {/* NAME CARD */}
          <div className={styles.infoCard}>
            <div className={styles.rowHeader}>
              <span className={styles.label}>Name</span>
              <FiEdit2 size={16} className={styles.editIcon}/>
            </div>

            <div className={styles.value}>Ayush Singh</div>

            {/* UPDATED TEXT HERE */}
            <p className={styles.helperText}>
              Your name is visible to other students on the leaderboards and public rank lists.
            </p>
          </div>

          {/* EMAIL CARD */}
          <div className={styles.infoCard}>
            <div className={styles.rowHeader}>
              <span className={styles.label}>Email Address</span>
              <FiEdit2 size={16} className={styles.editIcon}/>
            </div>

            <div className={styles.value}>
              iamayushcodes@gmail.com
            </div>
          </div>

        </div>
      </div>

      {/* LOGOUT */}
      <div className={styles.actionCard}>
        <button className={styles.logoutBtn}>Log Out</button>
      </div>

    </div>
  );
}