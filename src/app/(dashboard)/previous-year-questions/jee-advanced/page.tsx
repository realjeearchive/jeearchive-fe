import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './jeeAdvanced.module.css';

const JeeAdvanced = () => {
  type JeeAdvancedYear = {
    id: string;
    title: string;
    href: string;
    meta: string;
  };

  const jeeAdvancedYearItems: JeeAdvancedYear[] = [
    { id: "2026", title: "2026", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2026" },
    { id: "2025", title: "2025", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2025" },
    { id: "2024", title: "2024", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2024" },
    { id: "2023", title: "2023", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2023" },
    { id: "2022", title: "2022", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2022" },
    { id: "2021", title: "2021", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2021" },
    { id: "2020", title: "2020", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2020" },
    { id: "2019", title: "2019", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2019" },
    { id: "2018", title: "2018", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2018" },
    { id: "2017", title: "2017", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2017" },
    { id: "2016", title: "2016", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2016" },
    { id: "2015", title: "2015", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2015" },
    { id: "2014", title: "2014", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2014" },
    { id: "2013", title: "2013", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2013" },
    { id: "2012", title: "2012", meta: "2 Papers", href: "/previous-year-questions/jee-advanced/2012" },
  ];

  return (
    <div className={Styles.jeeAdvancedPage}>
      <TestListSection heading="JEE Advanced" items={jeeAdvancedYearItems} />
    </div>
  );
};

export default JeeAdvanced;