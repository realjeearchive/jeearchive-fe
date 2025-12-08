"use client";

import styles from "./dashboard.module.css";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardWrapper}>

      {/* HEADER */}
      <section className={styles.header}>
        <h2 className={styles.greeting}>Welcome back, Ayush 👋</h2>
        <p className={styles.subtext}>Here’s your JEE preparation overview.</p>
      </section>

      {/* QUICK ACTIONS */}
      <section className={styles.quickActions}>
        <div className={styles.actionCard}>Continue Previous Test</div>
        <div className={styles.actionCard}>Start Mock Test</div>
        <div className={styles.actionCard}>Solve Random PYQs</div>
      </section>

      {/* PROGRESS GRID */}
      <section className={styles.progressGrid}>
        <div className={styles.progressCard}>
          <h3>Total Questions Solved</h3>
          <p className={styles.progressValue}>1240</p>
        </div>
        <div className={styles.progressCard}>
          <h3>Accuracy</h3>
          <p className={styles.progressValue}>78%</p>
        </div>
        <div className={styles.progressCard}>
          <h3>Avg Time / Question</h3>
          <p className={styles.progressValue}>47 sec</p>
        </div>
        <div className={styles.progressCard}>
          <h3>Your Rank</h3>
          <p className={styles.progressValue}>#142</p>
        </div>
      </section>

      {/* SUBJECT PERFORMANCE */}
      <section className={styles.subjectSection}>
        <h3 className={styles.sectionTitle}>Subject Performance</h3>

        <div className={styles.subjectGrid}>
          <div className={styles.subjectCard}>
            <h4>Physics</h4>
            <div className={styles.subjectValue}>75%</div>
          </div>

          <div className={styles.subjectCard}>
            <h4>Chemistry</h4>
            <div className={styles.subjectValue}>82%</div>
          </div>

          <div className={styles.subjectCard}>
            <h4>Mathematics</h4>
            <div className={styles.subjectValue}>69%</div>
          </div>
        </div>
      </section>

      {/* WEAK TOPICS */}
      <section className={styles.weakTopics}>
        <h3 className={styles.sectionTitle}>Weak Topics</h3>
        <ul>
          <li>Rotational Motion — 54% Accuracy</li>
          <li>Mole Concept — 49% Accuracy</li>
          <li>Binomial Theorem — 40% Accuracy</li>
        </ul>
      </section>

      {/* ACTIVITY TIMELINE */}
      <section className={styles.activitySection}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>

        <ul className={styles.activityList}>
          <li>Solved 22 PYQs in Kinematics</li>
          <li>Completed Mock Test 5</li>
          <li>Improved accuracy in Organic Chemistry</li>
          <li>Achieved 2-day practice streak</li>
        </ul>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className={styles.leaderboard}>
        <h3 className={styles.sectionTitle}>Leaderboard Snapshot</h3>

        <div className={styles.leaderboardCard}>
          <p>🥇 Rohan — 2450 pts</p>
          <p>🥈 Sneha — 2130 pts</p>
          <p>🥉 Aakash — 1980 pts</p>
          <div className={styles.yourRank}>You — Rank #142</div>
        </div>
      </section>

      {/* MOTIVATION */}
      <section className={styles.motivation}>
        <p className={styles.quote}>
          “Success is the sum of small efforts repeated day in and day out.”
        </p>
      </section>

    </div>
  );
};

export default DashboardPage;
