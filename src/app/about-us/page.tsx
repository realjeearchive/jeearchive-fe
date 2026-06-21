import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import styles from '../StaticPage.module.css';

export const metadata = {
  title: 'About Us | JEE Archive',
  description: 'Learn more about JEE Archive and our mission.',
};

export default function AboutUsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Link href="/login" className={styles.backLink}>
          <MdArrowBack className={styles.backIcon} />
          <span>Back to Login</span>
        </Link>

        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>JEE Archive</span>
          <h1 className={styles.pageTitle}>Built for aspirants,<br />by aspirants.</h1>
          <p className={styles.pageSubtitle}>
            We believe every student deserves the best tools to crack one of the world&apos;s toughest examinations, regardless of background or city.
          </p>
        </div>

        <div className={styles.contentSection}>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>Mission</span>
            <h2 className={styles.sectionTitle}>Why we exist</h2>
            <div className={styles.sectionBody}>
              <p>
                JEE Archive exists to democratise access to high-quality JEE preparation. The best resources should not be locked behind geography or privilege. We are building a platform that is precise, distraction-free, and deeply analytical, a serious tool for serious students.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>Platform</span>
            <h2 className={styles.sectionTitle}>What we offer</h2>
            <div className={styles.sectionBody}>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureNumber}>01</span>
                  <div className={styles.featureContent}>
                    <div className={styles.featureTitle}>Chapter-wise PYQs</div>
                    <div className={styles.featureText}>
                      Previous Year Questions categorised by subject and chapter. Attack weak areas systematically, not at random.
                    </div>
                  </div>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureNumber}>02</span>
                  <div className={styles.featureContent}>
                    <div className={styles.featureTitle}>Real NTA Interface</div>
                    <div className={styles.featureText}>
                      Mock tests that mirror the actual NTA exam interface exactly. Practice the same environment you face on exam day.
                    </div>
                  </div>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureNumber}>03</span>
                  <div className={styles.featureContent}>
                    <div className={styles.featureTitle}>In-Depth Analytics</div>
                    <div className={styles.featureText}>
                      Track accuracy, time-per-question, and subject-wise trends over time. Know exactly where your effort has the most impact.
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionNumber}>Vision</span>
            <h2 className={styles.sectionTitle}>Where we are headed</h2>
            <div className={styles.sectionBody}>
              <p>
                We envision a future where technology closes the gap between hard work and results. JEE Archive aims to be the one platform every serious aspirant trusts, not because of marketing, but because it genuinely works.
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