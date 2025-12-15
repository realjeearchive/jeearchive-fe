
import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import styles from './dashboard.module.css';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';
import TestListSection, {
  TestListItem,
} from "@/components/dashboard/TestListSection/TestListSection";


// example data
const pyqItems: TestListItem[] = [
  { id: "pyq-2025", title: "2025 PYQs", meta: "19 Tests" },
  { id: "pyq-2024", title: "2024 PYQs", meta: "20 Tests"  },
  { id: "pyq-2023-2021", title: "2023 – 2021 PYQs", meta: "72 Tests" },
];

const chapterItems: TestListItem[] = [
  { id: "phy", title: "Physics", meta: "159 Tests"},
  { id: "chem", title: "Chemistry", meta: "160 Tests"},
  { id: "math", title: "Mathematics", meta: "161 Tests"},
];

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
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        <TestListSection heading="Previous Year Questions" items={pyqItems} />
        <TestListSection heading="Topic & Chapter-wise Questions" items={chapterItems} />
      </div>
    </div>
  );
}
