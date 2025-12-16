import TestListSection, {TestListItem} from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './previousYearQuestions.module.css';

const TestPage = () => {

  const pyqItems: TestListItem[] = [
    { id: "jee-main", title: "Jee Mains", meta: "100 Tests", href:"/previous-year-questions/jee-mains" },
    { id: "jee-advanced", title: "Jee Advanced", meta: "20 Tests", href:"/previous-year-questions/jee-advanced"  },
  ];

  return (
    <div className={Styles.previousYearQuestions}>
      <TestListSection heading="Previous Year Questions" items={pyqItems} />
    </div>
  );
};

export default TestPage;