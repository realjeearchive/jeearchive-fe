"use client";

import { useState } from "react";
import { toast } from "sonner";
import styles from "./BottomConsentBar.module.css";

interface Props {
  note: string;
  onConsent: () => void;
  customLabel?: string;
}

export function BottomConsentBar({ note, onConsent, customLabel = "I am ready to begin" }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  const handleBegin = async () => {
    if (!isChecked) {
      toast.error("Please read and agree to the instructions.");
      return; 
    }

    const el = document.documentElement;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen failed", err);
      }
    }

    onConsent();
  };

  return (
    <footer className={styles.bottomBar} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.noteRed}>{note}</p>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className={styles.checkbox}
              aria-describedby="consent-declaration"
            />
            <span id="consent-declaration" className={styles.checkboxText}>
              I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. If any prohibited material with me into the Examination Hall, I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.
            </span>
          </label>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.readyButton}
            onClick={handleBegin}
            disabled={!isChecked}
            aria-label={customLabel}
            style={{ 
              opacity: isChecked ? 1 : 0.7, 
              cursor: 'pointer' 
            }}
          >
            {customLabel}
          </button>
        </div>
      </div>
    </footer>
  );
}