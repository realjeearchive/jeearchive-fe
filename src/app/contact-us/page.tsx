import Link from 'next/link';
import { MdArrowBack, MdEmail, MdForum, MdExpandMore } from 'react-icons/md';
import styles from '../StaticPage.module.css';

export const metadata = {
  title: 'Contact Us | JEE Archive',
  description: 'Get in touch with the JEE Archive team.',
};

export default function ContactUsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Link href="/login" className={styles.backLink}>
          <MdArrowBack className={styles.backIcon} />
          <span>Back to Login</span>
        </Link>

        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>Get in Touch</span>
          <h1 className={styles.pageTitle}>We read<br />everything.</h1>
          <p className={styles.pageSubtitle}>
            Bug report, content correction, feature idea, we are a small team and we take every message seriously.
          </p>
        </div>

        {/* Contact channels */}
        <div className={styles.contactChannels}>
          <div className={styles.contactChannel}>
            <MdEmail className={styles.contactChannelIcon} />
            <div className={styles.contactChannelInfo}>
              <div className={styles.contactChannelTitle}>Email Support</div>
              <div className={styles.contactChannelDesc}>techjeearchive@gmail.com · replies within 24 hours</div>
            </div>
            <a href="mailto:support@jeearchive.com" className={styles.contactLink}>
              Send email
              <MdExpandMore className={styles.contactLinkArrow} style={{ transform: 'rotate(-90deg)' }} />
            </a>
          </div>

          <div className={styles.contactChannel}>
            <MdForum className={styles.contactChannelIcon} />
            <div className={styles.contactChannelInfo}>
              <div className={styles.contactChannelTitle}>Discord Community</div>
              <div className={styles.contactChannelDesc}>Thousands of aspirants — questions, strategy, peer help</div>
            </div>
            <a href="#" className={styles.contactLink}>
              Join server
              <MdExpandMore className={styles.contactLinkArrow} style={{ transform: 'rotate(-90deg)' }} />
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <div className={styles.faqSectionHeader}>
            <span className={styles.faqSectionLabel}>FAQ</span>
            <h2 className={styles.faqSectionTitle}>Common questions</h2>
          </div>

          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary>
                <span className={styles.faqQuestion}>How quickly do you respond to emails?</span>
                <MdExpandMore className={styles.faqChevron} />
              </summary>
              <p className={styles.faqAnswer}>
                We aim to reply within 24 hours. During high-traffic periods around exam season it may take a little longer, but we will always get back to you.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>
                <span className={styles.faqQuestion}>I found a mistake in a PYQ. What should I do?</span>
                <MdExpandMore className={styles.faqChevron} />
              </summary>
              <p className={styles.faqAnswer}>
                Email us with a screenshot of the question and a brief description of the error. Our content team reviews these the same day and pushes corrections immediately.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>
                <span className={styles.faqQuestion}>Can I request a new feature?</span>
                <MdExpandMore className={styles.faqChevron} />
              </summary>
              <p className={styles.faqAnswer}>
                Absolutely. JEE Archive is built for students and your feedback directly shapes what we build next. Send us an email with your idea, the best ones end up on the roadmap.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>
                <span className={styles.faqQuestion}>I am having trouble logging into my account.</span>
                <MdExpandMore className={styles.faqChevron} />
              </summary>
              <p className={styles.faqAnswer}>
                Email us from the address linked to your account and include any error messages you are seeing. Most login issues are resolved within a few hours.
              </p>
            </details>
          </div>
        </div>

        <div className={styles.footer}>
          <p>© {new Date().getFullYear()} JEE Archive. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact-us">Contact Us</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}