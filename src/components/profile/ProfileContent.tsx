"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.css";
import { FiEdit2, FiChevronDown, FiCheck } from "react-icons/fi";

import { useAuthStore, useUserStore } from "@/store";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../layout/LogoutConfirmPopup/LogoutConfirmModal";

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select",
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.customSelectContainer} ref={dropdownRef}>
      <button
        className={`${styles.customSelectTrigger} ${isOpen ? styles.triggerActive : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={selectedOption ? selectedOption.label : placeholder}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? (
            <span className={styles.optionContent}>
              {selectedOption.icon && (
                <span className={styles.optionIcon} aria-hidden="true">
                  {selectedOption.icon}
                </span>
              )}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <FiChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox" aria-label={placeholder}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.dropdownItem} ${option.value === value ? styles.itemSelected : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              tabIndex={0}
            >
              <span className={styles.optionContent}>
                {option.icon && (
                  <span className={styles.optionIcon} aria-hidden="true">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </span>
              {option.value === value && (
                <FiCheck size={12} className={styles.checkIcon} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProfileContent() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutAuth = useAuthStore((s) => s.logout);
  const clearProfile = useUserStore((s) => s.setProfile);
  const profile = useUserStore((s) => s.profile);

  const [selectedClass, setSelectedClass] = useState("12");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email ?? "No email provided";
  const initials = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleConfirmLogout = () => {
    logoutAuth();
    clearProfile(null);
    toast.success("Logged out successfully.");
    setShowLogoutModal(false);
    router.push("/login");
  };

  const handleSaveChanges = async () => {
    if (!mobileNumber.trim()) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      console.log("Saving Data:", {
        class: selectedClass,
        country: countryCode,
        mobile: mobileNumber,
      });
      toast.success("Profile details updated successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const classOptions = [
    { label: "Class 9", value: "9" },
    { label: "Class 10", value: "10" },
    { label: "Class 11", value: "11" },
    { label: "Class 12", value: "12" },
    { label: "Dropper", value: "dropper" },
    { label: "Other", value: "other" },
  ];

  const countryOptions = [
    { label: "+91", value: "+91", icon: "🇮🇳" },
    { label: "+1", value: "+1", icon: "🇺🇸" },
    { label: "+44", value: "+44", icon: "🇬🇧" },
    { label: "+81", value: "+81", icon: "🇯🇵" },
    { label: "+971", value: "+971", icon: "🇦🇪" },
  ];

  return (
    <>
      <main className={styles.container} aria-label="Account settings">
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
                <FiEdit2 size={16} className={styles.editIcon} aria-hidden="true" />
              </div>
              <div className={styles.value}>{displayName}</div>
              <p className={styles.helperText}>
                Your name is visible to other students on the leaderboards and
                public rank lists.
              </p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Email Address</span>
                <FiEdit2 size={16} className={styles.editIcon} aria-hidden="true" />
              </div>
              <div className={styles.value}>{displayEmail}</div>
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
              <div className={styles.inputContainer}>
                <CustomDropdown
                  options={classOptions}
                  value={selectedClass}
                  onChange={setSelectedClass}
                  placeholder="Select class"
                />
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Mobile Number</span>
              </div>
              <div className={styles.mobileInputGroup}>
                <div className={styles.countryDropdownWrapper}>
                  <CustomDropdown
                    options={countryOptions}
                    value={countryCode}
                    onChange={setCountryCode}
                    placeholder="Country code"
                  />
                </div>

                <input
                  type="tel"
                  className={styles.styledInput}
                  placeholder="Enter phone number"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/\D/g, ""))
                  }
                  aria-label="Mobile phone number"
                />
              </div>
            </div>
          </div>

          <div className={styles.saveActionRow}>
            <button
              className={styles.saveBtn}
              onClick={handleSaveChanges}
              disabled={isSaving}
              aria-label={isSaving ? "Saving changes" : "Save profile changes"}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
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