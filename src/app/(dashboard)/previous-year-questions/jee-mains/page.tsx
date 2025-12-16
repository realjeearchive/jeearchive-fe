import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './jeeMains.module.css';


const JeeMains = () => {
  type JeeMainYear = {
  id: string;
  title: string;
  href: string;
  meta: string;
};


  const jeeMainsYearItems: JeeMainYear[] = [
  { id: "2025", title: "2025", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2025" },
  { id: "2024", title: "2024", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2024" },
  { id: "2023", title: "2023", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2023" },
  { id: "2022", title: "2022", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2022" },
  { id: "2021", title: "2021", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2021" },
  { id: "2020", title: "2020", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2020" },
  { id: "2019", title: "2019", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2019" },
  { id: "2018", title: "2018", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2018" },
  { id: "2017", title: "2017", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2017" },
  { id: "2016", title: "2016", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2016" },
  { id: "2015", title: "2015", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2015" },
  { id: "2014", title: "2014", meta: "20 Tests", href: "/previous-year-questions/jee-mains/2014" },
];


  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection heading="Jee Mains" items={jeeMainsYearItems} />
    </div>
  );
};


export default JeeMains
