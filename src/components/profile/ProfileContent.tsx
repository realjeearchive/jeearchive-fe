"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.css";
import { useAuthStore, useUserStore } from "@/store";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../layout/LogoutConfirmPopup/LogoutConfirmModal";
import { updateProfileRequest } from "@/features/users/api";
import { FiEdit2, FiChevronDown } from "react-icons/fi";

export default function ProfileContent() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Inline Editing States
  const [editingField, setEditingField] = useState<"name" | "className" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutAuth = useAuthStore((s) => s.logout);
  const clearProfile = useUserStore((s) => s.clearUser);
  const profile = useUserStore((s) => s.profile);
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const isLoadingProfile = useUserStore((s) => s.isLoadingProfile);

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

  const startEditing = (field: "name" | "className") => {
    setEditingField(field);
    if (field === "name") setEditValue(profile?.name || "");
    if (field === "className") setEditValue(profile?.className || profile?.class || "");
    setIsDropdownOpen(false);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
    setIsDropdownOpen(false);
  };

  const handleSaveField = async () => {
    if (!editValue.trim()) {
      toast.error("Field cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfileRequest({
        name: editingField === "name" ? editValue : profile?.name || "",
        className: editingField === "className" ? editValue : profile?.className || profile?.class || "",
        mobileNumber: Number(profile?.mobileNumber) || 0,
        countryCode: profile?.countryCode || "",
        gender: profile?.gender || "",
        category: profile?.category || "",
      });

      toast.success("Profile updated successfully!");
      await fetchProfile(true);
      cancelEditing();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email ?? "No email provided";
  const initials = displayName.trim().charAt(0).toUpperCase() || "G";

  const rawClass = profile?.className || profile?.class || "Not specified";
  const displayClass = rawClass.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const displayGender = profile?.gender || "Not specified";
  const displayCategory = profile?.category || "Not specified";
  
  const displayMobile = profile?.mobileNumber
    ? `${profile?.countryCode ? `+${profile.countryCode.replace("+", "")} ` : ""}${profile.mobileNumber}`
    : "Not specified";

  const classOptions = ["class_11", "class_12", "dropper", "class_10_or_below"];

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
            
            {/* NAME FIELD */}
            <div className={`${styles.infoCard} ${editingField === "name" ? styles.infoCardEditing : ""}`}>
              <span className={`${styles.floatingLabel} ${editingField === "name" ? styles.floatingLabelEditing : ""}`}>
                Name
              </span>
              
              {editingField !== "name" && (
                <button className={styles.floatingEditBtn} onClick={() => startEditing("name")}>
                  <FiEdit2 className={styles.editIcon} />
                </button>
              )}
              
              <div className={styles.valueContainer}>
                {isLoadingProfile ? (
                  "Loading..."
                ) : editingField === "name" ? (
                  <div className={styles.editBlock}>
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <div className={styles.editActions}>
                      <button onClick={handleSaveField} disabled={isSaving} className={styles.saveBtnPrimary}>
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEditing} disabled={isSaving} className={styles.cancelBtn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  displayName
                )}
              </div>
              
              {editingField !== "name" && (
                <p className={styles.helperText}>
                  Your name is visible to other students on the leaderboards and public rank lists.
                </p>
              )}
            </div>

            {/* EMAIL FIELD (Not editable) */}
            <div className={styles.infoCard}>
              <span className={styles.floatingLabel}>Email Address</span>
              
              <div className={styles.valueContainer} style={{ opacity: 0.8 }}>
                {isLoadingProfile ? "Loading..." : displayEmail}
              </div>
              <p className={styles.helperText}>
                Email address is verified and cannot be changed directly.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.detailsSection} aria-label="Academic and contact details">
          <h2 className={styles.sectionHeading}>Academic & Contact Details</h2>

          <div className={styles.formGrid}>
            
            {/* CLASS FIELD */}
            <div className={`${styles.infoCard} ${editingField === "className" ? styles.infoCardEditing : ""}`}>
              <span className={`${styles.floatingLabel} ${editingField === "className" ? styles.floatingLabelEditing : ""}`}>
                Class / Grade
              </span>

              {editingField !== "className" && (
                <button className={styles.floatingEditBtn} onClick={() => startEditing("className")}>
                  <FiEdit2 className={styles.editIcon} />
                </button>
              )}
              
              <div className={styles.valueContainer}>
                {isLoadingProfile ? (
                  "Loading..."
                ) : editingField === "className" ? (
                  <div className={styles.editBlock}>
                    <div className={styles.customSelectContainer}>
                      <button
                        type="button"
                        className={`${styles.editInput} ${styles.selectTrigger} ${isDropdownOpen ? styles.triggerActive : ""}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={styles.selectedValue}>
                          {editValue ? editValue.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Select Class"}
                        </span>
                        <FiChevronDown className={styles.chevron} />
                      </button>
                      
                      {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                          {classOptions.map((opt) => (
                            <div
                              key={opt}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setEditValue(opt);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {opt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.editActions}>
                      <button onClick={handleSaveField} disabled={isSaving} className={styles.saveBtnPrimary}>
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEditing} disabled={isSaving} className={styles.cancelBtn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  displayClass
                )}
              </div>
            </div>

            {/* GENDER FIELD */}
            <div className={styles.infoCard}>
              <span className={styles.floatingLabel}>Gender</span>
              <div className={styles.valueContainer} style={{ opacity: 0.8 }}>
                {isLoadingProfile ? "Loading..." : displayGender}
              </div>
            </div>

            {/* CATEGORY FIELD */}
            <div className={styles.infoCard}>
              <span className={styles.floatingLabel}>Category</span>
              <div className={styles.valueContainer} style={{ opacity: 0.8 }}>
                {isLoadingProfile ? "Loading..." : displayCategory}
              </div>
            </div>

            {/* MOBILE NUMBER FIELD */}
            <div className={styles.infoCard}>
              <span className={styles.floatingLabel}>Mobile Number</span>
              <div className={styles.valueContainer} style={{ opacity: 0.8 }}>
                {isLoadingProfile ? "Loading..." : displayMobile}
              </div>
              <p className={styles.helperText}>
                Your number is kept private and secure. We will never share it or send spam.
              </p>
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