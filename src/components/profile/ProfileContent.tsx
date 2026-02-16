"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.css";
import { FiCamera, FiEdit2 } from "react-icons/fi";

// Store Imports
import { useAuthStore, useUserStore } from "@/store";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../layout/LogoutConfirmPopup/LogoutConfirmModal";

export default function ProfileContent() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STORE DATA ---
  const logoutAuth = useAuthStore((s) => s.logout);
  const clearProfile = useUserStore((s) => s.setProfile);
  const profile = useUserStore((s) => s.profile);

  // --- DERIVED DATA ---
  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email ?? "No email provided";
  const initials = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  // --- HANDLERS ---
  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    logoutAuth();
    clearProfile(null);
    toast.success("Logged out successfully.");
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Account Settings</h1>

        {/* TOP SECTION */}
        <div className={styles.topSection}>
          
          {/* LEFT AVATAR CARD */}
          <div className={styles.avatarCard}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitial}>{initials}</span>
              {/* <button className={styles.cameraBadge}>
                <FiCamera size={14} />
              </button> */}
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

              <div className={styles.value}>{displayName}</div>

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
                {displayEmail}
              </div>
            </div>

          </div>
        </div>

        {/* LOGOUT */}
        <div className={styles.actionCard}>
          <button 
            className={styles.logoutBtn} 
            onClick={openLogoutModal}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION POPUP */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}