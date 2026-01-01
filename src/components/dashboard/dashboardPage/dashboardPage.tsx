
import styles from './dashboardPage.module.css';
import KpiCard from '@/components/dashboard/KpiCard/KpiCard';
import ScoreGrowthChart from '@/components/dashboard/ScoreGrowthChart/ScoreGrowthChart';
import SubjectBalanceRadar from '@/components/dashboard/SubjectBalanceRadar/SubjectBalanceRadar';
import QuestionTypeBar from '@/components/dashboard/QuestionTypeBar/QuestionsTypeBar';
import TestListSection, {
  TestListItem,
} from "@/components/dashboard/TestListSection/TestListSection";
import DetailedAnalysisSection from '@/components/dashboard/DetailedAnalysisSection/DetailedAnalysisSection';
import { FiAward, FiClock, FiTarget, FiTrendingUp } from 'react-icons/fi';
import PyqProgressCard from "@/components/dashboard/PyqProgressCard/PyqProgressCard";



// example data
const pyqItems: TestListItem[] = [
  { id: "pyq-2025", title: "2025 PYQs", meta: "19 Tests", href: "/previous-year-questions/jee-mains/2025" },
  { id: "pyq-2024", title: "2024 PYQs", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2024" },
  { id: "pyq-2023", title: "2023 PYQs", meta: "18 Tests", href: "/previous-year-questions/jee-mains/2023" },
];

const chapterItems: TestListItem[] = [
  { id: "phy", title: "Physics", meta: "159 Tests", href: "/previous-year-questions/jee-mains" },
  { id: "chem", title: "Chemistry", meta: "160 Tests", href: "/previous-year-questions/jee-mains" },
  { id: "math", title: "Mathematics", meta: "161 Tests", href: "/previous-year-questions/jee-mains" },
];

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.progressRow}>
        <PyqProgressCard label="Physics" solved={2000} total={3000} />
        <PyqProgressCard label="Chemistry" solved={88} total={3000}  />
        <PyqProgressCard label="Mathematics" solved={860} total={3000}  />
      </div>


      <div className={styles.kpiRow}>
        <KpiCard
          label="Accuracy"
          value="78%"
          subLabel="Last 5 tests"
          icon={<FiTarget size={18} />}
          deltaLabel="+24%"
          tone="mint"
        />
        <KpiCard
          label="Avg Time / Question"
          value="47 sec"
          subLabel="Last 5 tests"
          icon={<FiClock size={18} />}
          deltaLabel="-12%"
          tone="mint"
        />
        <KpiCard
          label="Your Rank"
          value="#142"
          subLabel="Global leaderboard"
          icon={<FiAward size={18} />}
          deltaLabel="+8%"
          tone="mint"
        />
        <KpiCard
          label="Practice Streak"
          value="4 days"
          subLabel="Daily goal hit"
          icon={<FiTrendingUp size={18} />}
          deltaLabel="+47%"
          tone="mint"
        />
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
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 40 }}>
        <TestListSection heading="Previous Year Questions" items={pyqItems} />
        <TestListSection heading="Topic & Chapter-wise Questions" items={chapterItems} />
      </div>
      <div className={styles.detailedAnalysisWrapper}>
        <DetailedAnalysisSection />
      </div>
    </div>
  );
}
