"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.css";
import { useAuthStore, useUserStore } from "@/store";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../layout/LogoutConfirmPopup/LogoutConfirmModal";

export default function ProfileContent() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutAuth = useAuthStore((s) => s.logout);
  const clearProfile = useUserStore((s) => s.clearUser);
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isLoadingProfile = useUserStore((s) => s.isLoadingProfile);

  // 🔥 Fetch profile on mount to ensure the store always has the latest user data
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleConfirmLogout = () => {
    logoutAuth();
    clearProfile();
    toast.success("Logged out successfully.");
    setShowLogoutModal(false);
    router.push("/login");
  };

  // Safe fallback values
  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email ?? "No email provided";
  const initials = displayName.trim().charAt(0).toUpperCase() || "G";

  // Format details nicely
  const rawClass = profile?.className || profile?.class || "Not specified";
  const displayClass = rawClass.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const displayGender = profile?.gender || "Not specified";
  const displayCategory = profile?.category || "Not specified";
  
  const displayMobile = profile?.mobileNumber
    ? `${profile?.countryCode ? `+${profile.countryCode.replace("+", "")} ` : ""}${profile.mobileNumber}`
    : "Not specified";

  return (
    <>
      <main className={styles.container} aria-label="Account details">
        <h1 className={styles.pageTitle}>Account Settings</h1>

        <section className={styles.topSection} aria-label="Profile information">
          <div className={styles.avatarCard}>
            <div className={styles.avatar} aria-hidden="true">
              <span className={styles.avatarInitial}>{initials}</span>
            </div>
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Name</span>
              </div>
              <div className={styles.value}>
                {isLoadingProfile ? "Loading..." : displayName}
              </div>
              <p className={styles.helperText} style={{ marginTop: "8px" }}>
                Your name is visible to other students on the leaderboards and public rank lists.
              </p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Email Address</span>
              </div>
              <div className={styles.value} style={{ opacity: 0.8 }}>
                {isLoadingProfile ? "Loading..." : displayEmail}
              </div>
              <p className={styles.helperText} style={{ marginTop: "8px" }}>
                Email address is verified and cannot be changed directly.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.detailsSection} aria-label="Academic and contact details">
          <h2 className={styles.sectionHeading}>Academic & Contact Details</h2>

          <div className={styles.formGrid}>
            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Class / Grade</span>
              </div>
              <div className={styles.value} style={{ marginTop: "6px" }}>
                {isLoadingProfile ? "Loading..." : displayClass}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Gender</span>
              </div>
              <div className={styles.value} style={{ marginTop: "6px" }}>
                {isLoadingProfile ? "Loading..." : displayGender}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Category</span>
              </div>
              <div className={styles.value} style={{ marginTop: "6px" }}>
                {isLoadingProfile ? "Loading..." : displayCategory}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Mobile Number</span>
              </div>
              <div className={styles.value} style={{ marginTop: "6px" }}>
                {isLoadingProfile ? "Loading..." : displayMobile}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.actionCard}>
          <button
            className={styles.logoutBtn}
            onClick={openLogoutModal}
            aria-label="Log out of your account"
          >
            Log Out
          </button>
        </div>
      </main>

      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}