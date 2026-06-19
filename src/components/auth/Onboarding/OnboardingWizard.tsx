"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronDown,
  Target,
  UserCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import styles from "./OnboardingWizard.module.css";

import { useUserStore } from "@/store/userStore";
import {
  submitStage1Request,
  submitStage2Request,
  submitStage3Request,
} from "@/features/users/api";

// --- UI OPTIONS ---
const CATEGORIES = [
  "General",
  "General (PwD)",
  "General EWS",
  "General EWS (PwD)",
  "OBC-NCL",
  "OBC-NCL (PwD)",
  "SC",
  "SC (PwD)",
  "ST",
  "ST (PwD)",
];

const CLASSES = ["Class 11", "Class 12", "Dropper", "Class 10 or below"];
const GENDERS = ["Male", "Female", "Other"];

// API ENUM MAPPINGS
const CLASS_MAP: Record<string, string> = {
  "Class 11": "class_11",
  "Class 12": "class_12",
  Dropper: "Dropper",
  "Class 10 or below": "class_10_or_below",
};

const CATEGORY_MAP: Record<string, string> = {
  General: "General",
  "General (PwD)": "General_PwD",
  "General EWS": "General_EWS",
  "General EWS (PwD)": "General_EWS_PwD",
  "OBC-NCL": "OBC_NCL",
  "OBC-NCL (PwD)": "OBC_NCL_PwD",
  SC: "SC",
  "SC (PwD)": "SC_PwD",
  ST: "ST",
  "ST (PwD)": "ST_PwD",
};

const GENDER_MAP: Record<string, string> = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
};

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const { stageNumber, setStageNumber, fetchProfile } = useUserStore();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentClass: "",
    category: "",
    gender: "",
    mobile: "",
  });

  useEffect(() => {
    if (stageNumber && stageNumber > 1 && stageNumber <= 3) {
      setStep(stageNumber);
    } else if (stageNumber === 4) {
      router.replace(redirectTo);
    }
  }, [stageNumber, redirectTo, router]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.studentClass) {
        toast.error("Please select your class to continue.");
        return;
      }
      setIsSubmitting(true);
      try {
        const mappedClass = CLASS_MAP[formData.studentClass];
        await submitStage1Request({ className: mappedClass });
        setStageNumber(2);
        setDirection(1);
        setStep(2);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to save class. Please try again.";
        console.error(`[Onboarding] Stage 1 failed:`, error);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (step === 2) {
      if (!formData.category || !formData.gender) {
        toast.error("Please select both category and gender.");
        return;
      }
      setIsSubmitting(true);
      try {
        const mappedCategory = CATEGORY_MAP[formData.category];
        const mappedGender = GENDER_MAP[formData.gender];

        await submitStage2Request({
          category: mappedCategory,
          gender: mappedGender,
        });

        setStageNumber(3);
        setDirection(1);
        setStep(3);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to save details. Please try again.";
        console.error(`[Onboarding] Stage 2 failed:`, error);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitStage3Request({
        countryCode: "91",
        mobileNumber: Number(formData.mobile),
      });

      setStageNumber(4);
      fetchProfile();

      toast.success("Profile setup complete! Welcome aboard.");
      router.replace(redirectTo);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      console.error(`[Onboarding] Stage 3 failed:`, error);
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", ease: "circOut", duration: 0.35 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 24 : -24,
      opacity: 0,
      transition: { type: "tween", ease: "circIn", duration: 0.25 },
    }),
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgGlow} aria-hidden="true"></div>

      <div className={styles.wizardCard}>
        {/* Progress Header */}
        <header className={styles.header}>
          <div className={styles.progressContainer} aria-label={`Step ${step} of 3`}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div
                className={styles.progressFill}
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
            <div className={styles.progressSteps} role="list" aria-label="Progress steps">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  role="listitem"
                  className={`${styles.stepNode} ${
                    i === step
                      ? styles.stepNodeActive
                      : i < step
                      ? styles.stepNodeCompleted
                      : ""
                  }`}
                  aria-current={i === step ? "step" : undefined}
                  aria-label={`Step ${i}${i < step ? " completed" : ""}${i === step ? " current" : ""}`}
                >
                  {i < step ? (
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                  ) : (
                    i
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Sliding Content Area */}
        <div className={styles.contentArea}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.slideContainer}
            >
              {/* --- STEP 1: CLASS SELECTION --- */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                      <Target size={24} />
                    </div>
                    <h1 className={styles.title}>Select Your Class</h1>
                    <p className={styles.subtitle}>
                      Help us customize your practice experience.
                    </p>
                  </div>

                  <fieldset className={styles.grid2} aria-label="Select your class">
                    {CLASSES.map((cls) => (
                      <button
                        key={cls}
                        onClick={() =>
                          setFormData({ ...formData, studentClass: cls })
                        }
                        className={`${styles.selectionCard} ${
                          formData.studentClass === cls
                            ? styles.selectionCardActive
                            : ""
                        }`}
                        aria-pressed={formData.studentClass === cls}
                      >
                        <div className={styles.selectionHeader} aria-hidden="true">
                          <div
                            className={`${styles.radioCircle} ${
                              formData.studentClass === cls
                                ? styles.radioCircleActive
                                : ""
                            }`}
                          >
                            <div className={styles.radioInner} />
                          </div>
                        </div>
                        <span className={styles.selectionLabel}>{cls}</span>
                      </button>
                    ))}
                  </fieldset>
                </div>
              )}

              {/* --- STEP 2: CATEGORY & GENDER --- */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                      <UserCircle size={24} />
                    </div>
                    <h1 className={styles.title}>Category & Gender</h1>
                    <p className={styles.subtitle}>
                      We need this to predict your rank and percentile accurately.
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    {/* Category Dropdown */}
                    <div className={styles.fieldSection}>
                      <label className={styles.fieldLabel} htmlFor="category-dropdown">
                        Category
                      </label>
                      <div className={styles.dropdownContainer}>
                        <button
                          id="category-dropdown"
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`${styles.dropdownToggle} ${
                            isDropdownOpen ? styles.dropdownToggleActive : ""
                          }`}
                          aria-expanded={isDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          <span
                            className={
                              formData.category
                                ? styles.textPrimary
                                : styles.textPlaceholder
                            }
                          >
                            {formData.category || "Select Category"}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`${styles.chevron} ${
                              isDropdownOpen ? styles.rotate180 : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ type: "tween", duration: 0.2 }}
                              className={styles.dropdownMenu}
                              role="listbox"
                              aria-label="Select category"
                            >
                              {CATEGORIES.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    setFormData({ ...formData, category: cat });
                                    setIsDropdownOpen(false);
                                  }}
                                  className={styles.dropdownItem}
                                  role="option"
                                  aria-selected={formData.category === cat}
                                >
                                  {cat}
                                  {formData.category === cat && (
                                    <Check
                                      size={16}
                                      className={styles.checkIcon}
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <fieldset className={styles.fieldSection} aria-label="Select gender">
                      <legend className={styles.fieldLabel}>Gender</legend>
                      <div className={styles.grid3}>
                        {GENDERS.map((g) => (
                          <button
                            key={g}
                            onClick={() =>
                              setFormData({ ...formData, gender: g })
                            }
                            className={`${styles.selectionCard} ${
                              formData.gender === g
                                ? styles.selectionCardActive
                                : ""
                            }`}
                            aria-pressed={formData.gender === g}
                          >
                            <div className={styles.selectionHeader} aria-hidden="true">
                              <div
                                className={`${styles.radioCircle} ${
                                  formData.gender === g
                                    ? styles.radioCircleActive
                                    : ""
                                }`}
                              >
                                <div className={styles.radioInner} />
                              </div>
                            </div>
                            <span className={styles.selectionLabel}>{g}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>
              )}

              {/* --- STEP 3: MOBILE NUMBER --- */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                      <Phone size={24} />
                    </div>
                    <h1 className={styles.title}>Mobile Number</h1>
                    <p className={styles.subtitle}>
                      Just one last step to complete your profile.
                    </p>
                  </div>

                  <div className={styles.inputWrapper}>
                    <div className={styles.inputPrefix} aria-hidden="true">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, mobile: val });
                      }}
                      className={styles.mobileInput}
                      aria-label="Mobile number"
                    />
                  </div>
                  
                  <p className="text-[11px] text-[var(--text-secondary)] mt-3 text-center opacity-70 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} />
                    Don't worry, we won't send any spam or promotional calls.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <footer className={styles.footer}>
          {step > 1 ? (
            <button
              onClick={prevStep}
              className={styles.backButton}
              disabled={isSubmitting}
              aria-label="Go back to previous step"
            >
              <ChevronLeft size={20} aria-hidden="true" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className={styles.continueButton}
              disabled={isSubmitting}
              aria-label={isSubmitting ? "Saving" : "Continue to next step"}
            >
              <span>{isSubmitting ? "Saving..." : "Continue"}</span>
              {!isSubmitting && (
                <ChevronRight size={18} aria-hidden="true" />
              )}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.submitButton}
              aria-label={isSubmitting ? "Saving" : "Complete setup and go to dashboard"}
            >
              {isSubmitting ? "Saving..." : "Go to Dashboard"}
              {!isSubmitting && (
                <ChevronRight size={18} aria-hidden="true" />
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}