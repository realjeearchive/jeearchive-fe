"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, ChevronDown, Target, Award, Phone } from "lucide-react";
import { toast } from "sonner";
import styles from "./OnboardingWizard.module.css";

const CATEGORIES = [
  "General", "General (PwD)", "General EWS", "General EWS (PwD)",
  "OBC-NCL", "OBC-NCL (PwD)", "SC", "SC (PwD)", "ST", "ST (PwD)",
];

const CLASSES = ["Class 11", "Class 12", "Dropper", "Class 10 or below"];

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentClass: "",
    category: "",
    mobile: "",
  });

  const nextStep = () => {
    if (step === 1 && !formData.studentClass) {
      toast.error("Please select your class to continue.");
      return;
    }
    if (step === 2 && !formData.category) {
      toast.error("Please select your category.");
      return;
    }
    setDirection(1);
    setStep((prev) => prev + 1);
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Profile setup complete! Welcome to the dashboard.");
      router.push(redirectTo);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- Animation Variants: Strict tweens, absolutely zero bounce ---
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { 
        type: "tween", 
        ease: "circOut", // A mathematically smooth deceleration curve
        duration: 0.35 
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 24 : -24,
      opacity: 0,
      transition: { 
        type: "tween",
        ease: "circIn",
        duration: 0.25 
      }
    }),
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Decorative background glow */}
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

              {/* --- STEP 2: CATEGORY SELECTION --- */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper}><Award size={24} /></div>
                    <h2 className={styles.title}>Select your category</h2>
                    <p className={styles.subtitle}>Required for accurate percentile and cut-off predictions.</p>
                  </div>

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
                      /* Removed autoFocus here to stop the mobile browser from violently panning the screen */
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
            <button onClick={prevStep} className={styles.backButton}>
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          ) : (
            <div /> 
          )}

          {step < 3 ? (
            <button onClick={nextStep} className={styles.continueButton}>
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Saving..." : "Go to Dashboard"}
              {!isSubmitting && <ChevronRight size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}