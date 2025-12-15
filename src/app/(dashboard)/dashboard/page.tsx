import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import styles from './dashboard.module.css';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.kpiRow}>
        <KpiCard label="Accuracy" value="78%" subLabel="Last 5 tests" />
        <KpiCard label="Avg Time / Question" value="47 sec" subLabel="Last 5 tests" />
        <KpiCard label="Your Rank" value="#142" subLabel="Global leaderboard" />
        <KpiCard label="Practice Streak" value="4 days" subLabel="Daily goal hit" />
      </div>

      <div className={styles.growthSection}>
        <ScoreGrowthChart />
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomItem}>
          <SubjectBalanceRadar />
        </div>
        <div className={styles.bottomItem}>
          <QuestionTypeBar />
        </div>
      </div>
    </div>
  );
}
