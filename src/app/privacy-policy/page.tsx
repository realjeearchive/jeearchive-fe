import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import styles from '../StaticPage.module.css';

export const metadata = {
  title: 'Privacy Policy | JEE Archive',
  description: 'Privacy Policy for JEE Archive',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Link href="/login" className={styles.backLink}>
          <MdArrowBack className={styles.backIcon} />
          <span>Back to Login</span>
        </Link>

        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.pageSubtitle}>
            Your data helps us improve your preparation. We do not sell it. Here is exactly what we collect and why.
          </p>
          <span className={styles.pageMeta}>
            Last updated {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className={styles.contentSection}>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>01</span>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <div className={styles.sectionBody}>
              <p>We collect only what is needed to run the platform and personalise your experience.</p>
              <ul className={styles.list}>
                <li><strong>Account information :</strong> name, email address, mobile number, and password.</li>
                <li><strong>Performance data :</strong> test scores, practice history, accuracy rates, and time spent on questions.</li>
                <li><strong>Device information :</strong> browser and device details to ensure a secure, consistent experience.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>02</span>
            <h2 className={styles.sectionTitle}>How We Use It</h2>
            <div className={styles.sectionBody}>
              <ul className={styles.list}>
                <li>Delivering, personalising, and improving the platform.</li>
                <li>Generating actionable analytics from your test performance.</li>
                <li>Sending platform updates, security alerts, and support messages.</li>
                <li>Preventing fraud and enforcing our terms of service.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>03</span>
            <h2 className={styles.sectionTitle}>Sharing of Information</h2>
            <div className={styles.sectionBody}>
              <p>We do not sell, rent, or trade your personal information. We share it only in limited circumstances:</p>
              <ul className={styles.list}>
                <li><strong>Service providers : </strong> trusted vendors for hosting and analytics, bound by confidentiality agreements.</li>
                <li><strong>Legal compliance : </strong> if required by law or valid requests from public authorities.</li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>04</span>
            <h2 className={styles.sectionTitle}>Data Security</h2>
            <div className={styles.sectionBody}>
              <p>
                We use industry-standard encryption and secure server hosting to protect your information. No method of transmission over the internet is completely secure, but we take every reasonable precaution.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>05</span>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <div className={styles.sectionBody}>
              <p>
                Questions about this policy or our data practices? Reach us at{' '}
                <a href="mailto:support@jeearchive.com" style={{ color: 'var(--color-brand-primary, #F59E0B)', textDecoration: 'none' }}>
                  techjeearchive@gmail.com
                </a>
                {' '}and we will respond within 24 hours.
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