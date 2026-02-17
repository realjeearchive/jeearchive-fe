"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.css";
import { FiEdit2, FiChevronDown, FiCheck } from "react-icons/fi";

// Store Imports
import { useAuthStore, useUserStore } from "@/store";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../layout/LogoutConfirmPopup/LogoutConfirmModal";

// --- CUSTOM DROPDOWN COMPONENT ---
interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select" 
}: { 
  options: DropdownOption[], 
  value: string, 
  onChange: (val: string) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={styles.customSelectContainer} ref={dropdownRef}>
      <div 
        className={`${styles.customSelectTrigger} ${isOpen ? styles.triggerActive : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? (
            <span className={styles.optionContent}>
              {selectedOption.icon && <span className={styles.optionIcon}>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <FiChevronDown 
          size={14} 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div 
              key={option.value} 
              className={`${styles.dropdownItem} ${option.value === value ? styles.itemSelected : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className={styles.optionContent}>
                {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                {option.label}
              </span>
              {option.value === value && <FiCheck size={12} className={styles.checkIcon} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ProfileContent() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STORE DATA ---
  const logoutAuth = useAuthStore((s) => s.logout);
  const clearProfile = useUserStore((s) => s.setProfile);
  const profile = useUserStore((s) => s.profile);

  // --- FORM STATE ---
  const [selectedClass, setSelectedClass] = useState("12");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- DERIVED DATA ---
  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email ?? "No email provided";
  const initials = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  // --- HANDLERS ---
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
    
    // Simulate API Call
    setTimeout(() => {
      console.log("Saving Data:", { class: selectedClass, country: countryCode, mobile: mobileNumber });
      toast.success("Profile details updated successfully!");
      setIsSaving(false);
    }, 1000);
  };

  // --- OPTIONS DATA ---
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
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Account Settings</h1>

        {/* --- 1. EXISTING TOP SECTION (Avatar + Name/Email) --- */}
        <div className={styles.topSection}>
          <div className={styles.avatarCard}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitial}>{initials}</span>
            </div>
          </div>

          <div className={styles.infoWrapper}>
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

            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Email Address</span>
                <FiEdit2 size={16} className={styles.editIcon}/>
              </div>
              <div className={styles.value}>{displayEmail}</div>
            </div>
          </div>
        </div>


        {/* --- 2. NEW SECTION: ACADEMIC & CONTACT DETAILS --- */}
        <div className={styles.detailsSection}>
          
          <h2 className={styles.sectionHeading}>Academic & Contact Details</h2>

          <div className={styles.formGrid}>
            
            {/* CLASS SELECTION WITH CUSTOM DROPDOWN */}
            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Class / Grade</span>
              </div>
              <div className={styles.inputContainer}>
                <CustomDropdown 
                  options={classOptions} 
                  value={selectedClass} 
                  onChange={setSelectedClass} 
                />
              </div>
            </div>

            {/* MOBILE NUMBER WITH CUSTOM DROPDOWN */}
            <div className={styles.infoCard}>
              <div className={styles.rowHeader}>
                <span className={styles.label}>Mobile Number</span>
              </div>
              <div className={styles.mobileInputGroup}>
                
                {/* Country Code Custom Dropdown */}
                <div className={styles.countryDropdownWrapper}>
                  <CustomDropdown 
                    options={countryOptions} 
                    value={countryCode} 
                    onChange={setCountryCode} 
                  />
                </div>

                {/* Number Input */}
                <input 
                  type="number" 
                  className={styles.styledInput} 
                  placeholder="Enter phone number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* SAVE BUTTON */}
          <div className={styles.saveActionRow}>
             <button 
                className={styles.saveBtn} 
                onClick={handleSaveChanges}
                disabled={isSaving}
             >
                {isSaving ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </div>


        {/* --- 3. LOGOUT BUTTON --- */}
        <div className={styles.actionCard}>
          <button 
            className={styles.logoutBtn} 
            onClick={openLogoutModal}
          >
            Log Out
          </button>
        </div>

      </div>

      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}