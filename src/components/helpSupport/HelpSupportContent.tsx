"use client";

import React, { useState } from "react";
import styles from "./HelpSupportContent.module.css";
import {
  FiMail,
  FiMessageCircle,
  FiChevronDown,
  FiAlertCircle,
  FiSend,
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
    const success = await handleSubmitBugReport(bugDescription);
    if (success) {
      setBugDescription("");
    }
  };

  return (
    <main className={styles.container} aria-label="Help and support">
      <h1 className={styles.pageTitle}>Help & Support</h1>

      <section className={styles.topSectionFull} aria-label="Contact options">
        <div
          className={styles.clickableCard}
          onClick={handleEmailClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEmailClick();
            }
          }}
          aria-label="Send email to contactjeearchive@gmail.com"
        >
          <div className={styles.rowHeader}>
            <span className={styles.label}>Official Support Email</span>
            <FiMail size={16} aria-hidden="true" />
          </div>
          <div className={styles.value}>contactjeearchive@gmail.com</div>
          <p className={styles.helperText}>
            Click to send us an email via Gmail/Mail client.
          </p>
        </div>

        <div
          className={styles.clickableCard}
          onClick={handleDiscordClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDiscordClick();
            }
          }}
          aria-label="Join Discord community"
        >
          <div className={styles.rowHeader}>
            <span className={styles.label}>Community Support</span>
            <FiMessageCircle size={16} aria-hidden="true" />
          </div>
          <div className={styles.value}>Discord Community</div>
          <p className={styles.helperText}>
            Join our server to chat with moderators.
          </p>
        </div>
      </section>

      <section className={styles.detailsSection} aria-label="Frequently asked questions">
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqWrapper} role="list">
          {FAQ_LIST.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${activeFaq === index ? styles.faqActive : ""}`}
              role="listitem"
            >
              <button
                className={styles.faqHeader}
                onClick={() => toggleFaq(index)}
                aria-expanded={activeFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className={styles.faqTitleGroup}>
                  <span className={styles.qBadge} aria-hidden="true">
                    Q
                  </span>
                  <span className={styles.faqQuestion}>{faq.q}</span>
                </div>
                <FiChevronDown
                  className={styles.faqChevron}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={styles.faqBodyCollapse}
                role="region"
                aria-label={`Answer to: ${faq.q}`}
              >
                <div className={styles.faqBodyContent}>
                  <div className={styles.faqAnswerRow}>
                    <span className={styles.aBadge} aria-hidden="true">
                      A
                    </span>
                    <p className={styles.faqAnswerText}>{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.detailsSection} aria-label="Report a technical bug">
        <h2 className={styles.sectionHeading}>Report a Technical Bug</h2>
        <div className={styles.infoCard}>
          <div className={styles.rowHeader}>
            <span className={styles.label}>Bug Description</span>
            <FiAlertCircle size={16} aria-hidden="true" />
          </div>
          <textarea
            className={styles.bugTextArea}
            placeholder="Describe the issue in detail... (e.g., my percentile is not coming correctly)"
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            disabled={isSubmitting}
            aria-label="Bug description"
          />
        </div>
        <div className={styles.saveActionRow}>
          <button
            className={styles.saveBtn}
            onClick={handleReportBug}
            disabled={isSubmitting || !bugDescription.trim()}
            aria-label={
              isSubmitting ? "Submitting bug report" : "Submit bug report"
            }
          >
            <FiSend size={14} style={{ marginRight: "8px" }} aria-hidden="true" />
            {isSubmitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </div>
      </section>
    </main>
  );
}