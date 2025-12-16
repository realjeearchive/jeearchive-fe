import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from '../jeeMains.module.css';


const JeeMains2016 = () => {
  type JeeMainYear = {
  id: string;
  title: string;
  href: string;
  meta: string;
};


  const jeeMains2016Items: JeeMainYear[] = [
  { id: "jm-2016-01-20-s1", title: "JEE Mains 2016 20 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-20-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-20-s2", title: "JEE Mains 2016 20 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-20-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-21-s1", title: "JEE Mains 2016 21 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-21-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-21-s2", title: "JEE Mains 2016 21 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-21-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-22-s1", title: "JEE Mains 2016 22 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-22-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-22-s2", title: "JEE Mains 2016 22 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-22-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-23-s1", title: "JEE Mains 2016 23 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-23-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-23-s2", title: "JEE Mains 2016 23 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-23-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-24-s1", title: "JEE Mains 2016 24 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-24-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-24-s2", title: "JEE Mains 2016 24 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-24-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-25-s1", title: "JEE Mains 2016 25 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-25-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-25-s2", title: "JEE Mains 2016 25 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-25-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-26-s1", title: "JEE Mains 2016 26 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-26-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-26-s2", title: "JEE Mains 2016 26 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-26-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-27-s1", title: "JEE Mains 2016 27 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-27-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-27-s2", title: "JEE Mains 2016 27 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-27-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-28-s1", title: "JEE Mains 2016 28 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-28-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-28-s2", title: "JEE Mains 2016 28 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-28-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-29-s1", title: "JEE Mains 2016 29 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-29-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-29-s2", title: "JEE Mains 2016 29 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-29-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-30-s1", title: "JEE Mains 2016 30 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-30-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-30-s2", title: "JEE Mains 2016 30 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-30-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2016-01-31-s1", title: "JEE Mains 2016 31 Jan Shift 1", href: "/previous-year-questions/jee-mains/2016-01-31-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2016-01-31-s2", title: "JEE Mains 2016 31 Jan Shift 2", href: "/previous-year-questions/jee-mains/2016-01-31-shift-2", meta: "Shift 2 • Full Test" },
];





  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection heading="Jee Mains 2016" items={jeeMains2016Items} />
    </div>
  );
};


export default JeeMains2016
