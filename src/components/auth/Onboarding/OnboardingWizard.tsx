"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, ChevronDown, Target, UserCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import styles from "./OnboardingWizard.module.css";

import { useUserStore } from "@/store/userStore";
import { 
  submitStage1Request, 
  submitStage2Request, 
  submitStage3Request 
} from "@/features/users/api";

// --- UI OPTIONS ---
const CATEGORIES = [
  "General", "General (PwD)", "General EWS", "General EWS (PwD)",
  "OBC-NCL", "OBC-NCL (PwD)", "SC", "SC (PwD)", "ST", "ST (PwD)",
];

const CLASSES = ["Class 11", "Class 12", "Dropper", "Class 10 or below"];
const GENDERS = ["Male", "Female", "Other"];

// 🔥 NEW: API ENUM MAPPINGS
// This maps the pretty UI strings to the exact Prisma Enum values your backend expects
const CLASS_MAP: Record<string, string> = {
  "Class 11": "class_11",
  "Class 12": "class_12",
  "Dropper": "Dropper",
  "Class 10 or below": "class_10_or_below"
};

const CATEGORY_MAP: Record<string, string> = {
  "General": "General",
  "General (PwD)": "General_PwD",
  "General EWS": "General_EWS",
  "General EWS (PwD)": "General_EWS_PwD",
  "OBC-NCL": "OBC_NCL",
  "OBC-NCL (PwD)": "OBC_NCL_PwD",
  "SC": "SC",
  "SC (PwD)": "SC_PwD",
  "ST": "ST",
  "ST (PwD)": "ST_PwD"
};

const GENDER_MAP: Record<string, string> = {
  "Male": "Male",
  "Female": "Female",
  "Other": "Other"
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
        // 🔥 Use CLASS_MAP to send the correct enum to the backend
        const mappedClass = CLASS_MAP[formData.studentClass];
        
        await submitStage1Request({ className: mappedClass });
        setStageNumber(2); 
        setDirection(1);
        setStep(2);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to save class. Please try again.";
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
        // 🔥 Use MAPPINGS to send the correct enums to the backend
        const mappedCategory = CATEGORY_MAP[formData.category];
        const mappedGender = GENDER_MAP[formData.gender];

        await submitStage2Request({ 
          category: mappedCategory, 
          gender: mappedGender 
        });
        
        setStageNumber(3); 
        setDirection(1);
        setStep(3);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to save details. Please try again.";
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
        mobileNumber: Number(formData.mobile) 
      });
      
      // 🔥 FIX: Instantly tell the global store that onboarding is complete!
      // This immediately unblocks the RouteGuard so the redirect is seamless.
      setStageNumber(4);
      
      // Fire off the profile fetch in the background
      fetchProfile();
      
      toast.success("Profile setup complete! Welcome aboard.");
      router.replace(redirectTo);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
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
      transition: { type: "tween", ease: "circOut", duration: 0.35 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 24 : -24,
      opacity: 0,
      transition: { type: "tween", ease: "circIn", duration: 0.25 }
    }),
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgGlow}></div>

      <div className={styles.wizardCard}>
        
        {/* Progress Header */}
        <div className={styles.header}>
          <div className={styles.progressContainer}>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
            <div className={styles.progressSteps}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.stepNode} ${
                    i === step ? styles.stepNodeActive : i < step ? styles.stepNodeCompleted : ""
                  }`}
                >
                  {i < step ? <Check size={12} strokeWidth={3} /> : i}
                </div>
              ))}
            </div>
          </div>
        </div>

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
                    <div className={styles.iconWrapper}><Target size={24} /></div>
                    <h2 className={styles.title}>What is your target?</h2>
                    <p className={styles.subtitle}>Help us personalize your mock test analytics.</p>
                  </div>

                  <div className={styles.grid2}>
                    {CLASSES.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setFormData({ ...formData, studentClass: cls })}
                        className={`${styles.selectionCard} ${
                          formData.studentClass === cls ? styles.selectionCardActive : ""
                        }`}
                      >
                        <div className={styles.selectionHeader}>
                          <div className={`${styles.radioCircle} ${
                              formData.studentClass === cls ? styles.radioCircleActive : ""
                            }`}>
                            <div className={styles.radioInner} />
                          </div>
                        </div>
                        <span className={styles.selectionLabel}>{cls}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- STEP 2: CATEGORY & GENDER SELECTION --- */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper}><UserCircle size={24} /></div>
                    <h2 className={styles.title}>Personal Details</h2>
                    <p className={styles.subtitle}>Required for accurate percentile and cut-off predictions.</p>
                  </div>

                  <div className={styles.formGroup}>
                    {/* Category Dropdown */}
                    <div className={styles.fieldSection}>
                      <label className={styles.fieldLabel}>Category</label>
                      <div className={styles.dropdownContainer}>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`${styles.dropdownToggle} ${
                            isDropdownOpen ? styles.dropdownToggleActive : ""
                          }`}
                        >
                          <span className={formData.category ? styles.textPrimary : styles.textPlaceholder}>
                            {formData.category || "Choose your category..."}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`${styles.chevron} ${isDropdownOpen ? styles.rotate180 : ""}`}
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
                            >
                              {CATEGORIES.map((cat) => (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    setFormData({ ...formData, category: cat });
                                    setIsDropdownOpen(false);
                                  }}
                                  className={styles.dropdownItem}
                                >
                                  {cat}
                                  {formData.category === cat && (
                                    <Check size={16} className={styles.checkIcon} />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div className={styles.fieldSection}>
                      <label className={styles.fieldLabel}>Gender</label>
                      <div className={styles.grid3}>
                        {GENDERS.map((g) => (
                          <button
                            key={g}
                            onClick={() => setFormData({ ...formData, gender: g })}
                            className={`${styles.selectionCard} ${
                              formData.gender === g ? styles.selectionCardActive : ""
                            }`}
                          >
                            <div className={styles.selectionHeader}>
                              <div className={`${styles.radioCircle} ${
                                  formData.gender === g ? styles.radioCircleActive : ""
                                }`}>
                                <div className={styles.radioInner} />
                              </div>
                            </div>
                            <span className={styles.selectionLabel}>{g}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 3: MOBILE NUMBER --- */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper}><Phone size={24} /></div>
                    <h2 className={styles.title}>Almost there!</h2>
                    <p className={styles.subtitle}>What is the best number to reach you on?</p>
                  </div>

                  <div className={styles.inputWrapper}>
                    <div className={styles.inputPrefix}>+91</div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="99999 99999"
                      value={formData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, mobile: val });
                      }}
                      className={styles.mobileInput}
                    />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          {step > 1 ? (
            <button 
              onClick={prevStep} 
              className={styles.backButton}
              disabled={isSubmitting}
            >
              <ChevronLeft size={20} />
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
            >
              <span>{isSubmitting ? "Saving..." : "Continue"}</span>
              {!isSubmitting && <ChevronRight size={18} />}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Finalizing..." : "Go to Dashboard"}
              {!isSubmitting && <ChevronRight size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}