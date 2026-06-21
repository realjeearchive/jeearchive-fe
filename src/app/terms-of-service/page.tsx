import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import styles from '../StaticPage.module.css';

export const metadata = {
  title: 'Terms of Service | JEE Archive',
  description: 'Terms of Service for JEE Archive',
};

export default function TermsOfServicePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Link href="/login" className={styles.backLink}>
          <MdArrowBack className={styles.backIcon} />
          <span>Back to Login</span>
        </Link>

        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.pageTitle}>Terms of Service</h1>
          <p className={styles.pageSubtitle}>
            By using JEE Archive, you agree to these terms. Please read them before accessing the platform.
          </p>
          <span className={styles.pageMeta}>
            Last updated {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className={styles.contentSection}>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
            <div className={styles.sectionBody}>
              <p>
                By accessing and using the JEE Archive platform, you accept and agree to be bound by these terms. If you do not agree, please do not use our service.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2 className={styles.sectionTitle}>User Accounts</h2>
            <div className={styles.sectionBody}>
              <ul className={styles.list}>
                <li>You must provide accurate, complete, and current information when creating an account.</li>
                <li>You are responsible for safeguarding your password and all activity under your account.</li>
                <li>Notify us immediately upon becoming aware of any unauthorized use or security breach.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2 className={styles.sectionTitle}>Acceptable Use</h2>
            <div className={styles.sectionBody}>
              <p>You agree to use the platform only for lawful purposes. The following are prohibited:</p>
              <ul className={styles.list}>
                <li>Attempting to hack, destabilize, or reverse-engineer the platform or its source code.</li>
                <li>Using automated scripts or bots to extract data or interact with the testing interface.</li>
                <li>Sharing or distributing premium or private content without authorization.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2 className={styles.sectionTitle}>Intellectual Property</h2>
            <div className={styles.sectionBody}>
              <p>
                The platform and its original content, features, and functionality are and will remain the exclusive property of JEE Archive and its licensors. Our trademarks may not be used without prior written consent.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
            <div className={styles.sectionBody}>
              <p>
                JEE Archive and its affiliates shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, or goodwill, resulting from your use of or inability to access the platform.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>06</span>
            <h2 className={styles.sectionTitle}>Changes to Terms</h2>
            <div className={styles.sectionBody}>
              <p>
                We may modify these Terms at any time. Continued use of the platform after revisions become effective constitutes your acceptance of the updated terms.
              </p>
            </div>
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