"use client";

import React, { useState } from "react";
import styles from "./HelpSupportContent.module.css";
import { FiMail, FiMessageCircle, FiChevronDown, FiAlertCircle, FiSend } from "react-icons/fi";
import { toast } from "sonner";

const FAQ_LIST = [
  { q: "How do I reset my mock test progress?", a: "Go to Analytics and select 'Reset Data' in the settings menu." },
  { q: "Are the PYQs officially from NTA?", a: "Yes, all Previous Year Questions are sourced from official JEE Main papers." },
  { q: "Can I use the platform on my mobile phone?", a: "Absolutely! The dashboard is fully responsive for mobile browsers." },
  { q: "How is the percentile calculated?", a: "It is calculated based on your score relative to other students in our database." }
];

export default function HelpSupportContent() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bugDescription, setBugDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleEmailClick = () => { window.location.href = "mailto:contactjeearchive@gmail.com"; };
  const handleDiscordClick = () => { window.open("https://discord.com/invite/8Q9Nb2fATj", "_blank"); };

  const handleReportBug = () => {
    if (!bugDescription.trim()) {
      toast.error("Please describe the bug before submitting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Bug report submitted successfully!");
      setBugDescription("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Help & Support</h1>

      <div className={styles.topSectionFull}>
        <div className={styles.clickableCard} onClick={handleEmailClick}>
          <div className={styles.rowHeader}>
            <span className={styles.label}>Official Support Email</span>
            <FiMail size={16} />
          </div>
          <div className={styles.value}>contactjeearchive@gmail.com</div>
          <p className={styles.helperText}>Click to send us an email via Gmail/Mail client.</p>
        </div>

        <div className={styles.clickableCard} onClick={handleDiscordClick}>
          <div className={styles.rowHeader}>
            <span className={styles.label}>Community Support</span>
            <FiMessageCircle size={16} />
          </div>
          <div className={styles.value}>Discord Community</div>
          <p className={styles.helperText}>Join our server to chat with moderators.</p>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqWrapper}>
          {FAQ_LIST.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeFaq === index ? styles.faqActive : ""}`}
              onClick={() => toggleFaq(index)}
            >
              <div className={styles.faqHeader}>
                <div className={styles.faqTitleGroup}>
                    <span className={styles.qBadge}>Q</span>
                    <span className={styles.faqQuestion}>{faq.q}</span>
                </div>
                <FiChevronDown className={styles.faqChevron} />
              </div>
              

              <div className={styles.faqBodyCollapse}>
                <div className={styles.faqBodyContent}>
                  <div className={styles.faqAnswerRow}>
                     <span className={styles.aBadge}>A</span>
                     <p className={styles.faqAnswerText}>{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2 className={styles.sectionHeading}>Report a Technical Bug</h2>
        <div className={styles.infoCard}>
          <div className={styles.rowHeader}>
            <span className={styles.label}>Bug Description</span>
            <FiAlertCircle size={16} />
          </div>
          <textarea 
            className={styles.bugTextArea} 
            placeholder="Describe the issue in detail..."
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
          />
        </div>
        <div className={styles.saveActionRow}>
          <button className={styles.saveBtn} onClick={handleReportBug} disabled={isSubmitting}>
            <FiSend size={14} style={{ marginRight: '8px' }} />
            {isSubmitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </div>
      </div>
    </div>
  );
}