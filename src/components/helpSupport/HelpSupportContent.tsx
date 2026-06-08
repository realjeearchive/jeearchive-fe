"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./HelpSupportContent.module.css";
import {
  FiMail,
  FiMessageCircle,
  FiChevronDown,
  FiSend,
  FiExternalLink,
} from "react-icons/fi";
import { useHelpSupport } from "@/features/helpSupport/useHelpSupport";

const FAQ_LIST = [
  {
    q: "How do I reset my mock test progress?",
    a: "Go to Analytics and select 'Reset Data' in the settings menu.",
  },
  {
    q: "Are the PYQs officially from NTA?",
    a: "Yes, all Previous Year Questions are sourced from official JEE Main papers.",
  },
  {
    q: "Can I use the platform on my mobile phone?",
    a: "Absolutely! The dashboard is fully responsive for mobile browsers.",
  },
  {
    q: "How is the percentile calculated?",
    a: "It is calculated based on your score relative to other students in our database.",
  },
];

export default function HelpSupportContent() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bugDescription, setBugDescription] = useState("");
  const [reportType, setReportType] = useState<"TechnicalGlitch" | "Review">("TechnicalGlitch");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isSubmitting, handleSubmitBugReport } = useHelpSupport();

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:contactjeearchive@gmail.com";
  };

  const handleDiscordClick = () => {
    window.open("https://discord.com/invite/8Q9Nb2fATj", "_blank");
  };

  const handleReportBug = async () => {
    const success = await handleSubmitBugReport(bugDescription, reportType);
    if (success) {
      setBugDescription("");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className={styles.container} aria-label="Help and support">
      <h1 className={styles.pageTitle}>Help & Support</h1>

      {/* ── Contact ── */}
      <section className={styles.section} aria-label="Contact options">
        <div className={styles.contactGrid}>
          <button
            className={styles.contactCard}
            onClick={handleEmailClick}
            aria-label="Send email to contactjeearchive@gmail.com"
          >
            <div className={styles.contactIconWrap}>
              <FiMail size={18} aria-hidden="true" />
            </div>
            <div className={styles.contactBody}>
              <span className={styles.contactLabel}>Official Support Email</span>
              <span className={styles.contactValue}>contactjeearchive@gmail.com</span>
            </div>
            <FiExternalLink size={14} className={styles.contactArrow} aria-hidden="true" />
          </button>

          <button
            className={styles.contactCard}
            onClick={handleDiscordClick}
            aria-label="Join Discord community"
          >
            <div className={styles.contactIconWrap}>
              <FiMessageCircle size={18} aria-hidden="true" />
            </div>
            <div className={styles.contactBody}>
              <span className={styles.contactLabel}>Community Support</span>
              <span className={styles.contactValue}>Discord Community</span>
            </div>
            <FiExternalLink size={14} className={styles.contactArrow} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section} aria-label="Frequently asked questions">
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.card} role="list">
          {FAQ_LIST.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqRow} ${index < FAQ_LIST.length - 1 ? styles.faqRowBorder : ""}`}
              role="listitem"
            >
              <button
                className={styles.faqTrigger}
                onClick={() => toggleFaq(index)}
                aria-expanded={activeFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className={styles.faqLeft}>
                  <span className={styles.qBadge} aria-hidden="true">Q</span>
                  <span className={styles.faqQuestion}>{faq.q}</span>
                </div>
                <FiChevronDown
                  className={`${styles.chevron} ${activeFaq === index ? styles.chevronOpen : ""}`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`${styles.faqCollapse} ${activeFaq === index ? styles.faqCollapseOpen : ""}`}
                role="region"
                aria-label={`Answer to: ${faq.q}`}
              >
                <div className={styles.faqCollapseInner}>
                  <div className={styles.faqAnswer}>
                    <span className={styles.aBadge} aria-hidden="true">A</span>
                    <p className={styles.faqAnswerText}>{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className={styles.section} aria-label="Submit feedback or report bug">
        <h2 className={styles.sectionTitle}>Submit Feedback or Report Bug</h2>
        <div className={styles.card}>

          {/* Type selector */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Type</span>
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.dropdownToggle}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span>{reportType === "TechnicalGlitch" ? "Technical Glitch" : "Review / Feedback"}</span>
                <FiChevronDown
                  className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`}
                  aria-hidden="true"
                />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu} role="listbox">
                  <div
                    className={`${styles.dropdownItem} ${reportType === "TechnicalGlitch" ? styles.dropdownItemActive : ""}`}
                    role="option"
                    aria-selected={reportType === "TechnicalGlitch"}
                    onClick={() => { setReportType("TechnicalGlitch"); setIsDropdownOpen(false); }}
                  >
                    Technical Glitch
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${reportType === "Review" ? styles.dropdownItemActive : ""}`}
                    role="option"
                    aria-selected={reportType === "Review"}
                    onClick={() => { setReportType("Review"); setIsDropdownOpen(false); }}
                  >
                    Review / Feedback
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rowDivider} aria-hidden="true" />

          {/* Description */}
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>Description</span>
          </div>
          <textarea
            className={styles.textarea}
            placeholder={
              reportType === "TechnicalGlitch"
                ? "Describe the technical issue you encountered..."
                : "Share your thoughts, suggestions, or review..."
            }
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            disabled={isSubmitting}
            aria-label="Description"
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            onClick={handleReportBug}
            disabled={isSubmitting || !bugDescription.trim()}
            aria-label={isSubmitting ? "Submitting report" : "Submit report"}
          >
            <FiSend size={13} aria-hidden="true" />
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </section>
    </main>
  );
}