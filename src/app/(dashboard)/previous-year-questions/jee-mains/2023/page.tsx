import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from '../jeeMains.module.css';


const JeeMains2023 = () => {
  type JeeMainYear = {
  id: string;
  title: string;
  href: string;
  meta: string;
};


  const jeeMains2023Items: JeeMainYear[] = [
  { id: "jm-2023-01-20-s1", title: "JEE Mains 2023 20 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-20-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-20-s2", title: "JEE Mains 2023 20 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-20-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-21-s1", title: "JEE Mains 2023 21 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-21-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-21-s2", title: "JEE Mains 2023 21 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-21-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-22-s1", title: "JEE Mains 2023 22 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-22-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-22-s2", title: "JEE Mains 2023 22 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-22-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-23-s1", title: "JEE Mains 2023 23 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-23-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-23-s2", title: "JEE Mains 2023 23 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-23-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-24-s1", title: "JEE Mains 2023 24 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-24-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-24-s2", title: "JEE Mains 2023 24 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-24-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-25-s1", title: "JEE Mains 2023 25 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-25-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-25-s2", title: "JEE Mains 2023 25 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-25-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-26-s1", title: "JEE Mains 2023 26 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-26-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-26-s2", title: "JEE Mains 2023 26 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-26-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-27-s1", title: "JEE Mains 2023 27 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-27-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-27-s2", title: "JEE Mains 2023 27 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-27-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-28-s1", title: "JEE Mains 2023 28 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-28-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-28-s2", title: "JEE Mains 2023 28 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-28-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-29-s1", title: "JEE Mains 2023 29 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-29-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-29-s2", title: "JEE Mains 2023 29 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-29-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-30-s1", title: "JEE Mains 2023 30 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-30-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-30-s2", title: "JEE Mains 2023 30 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-30-shift-2", meta: "Shift 2 • Full Test" },
  { id: "jm-2023-01-31-s1", title: "JEE Mains 2023 31 Jan Shift 1", href: "/previous-year-questions/jee-mains/2023-01-31-shift-1", meta: "Shift 1 • Full Test" },
  { id: "jm-2023-01-31-s2", title: "JEE Mains 2023 31 Jan Shift 2", href: "/previous-year-questions/jee-mains/2023-01-31-shift-2", meta: "Shift 2 • Full Test" },
];





  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection heading="Jee Mains 2023" items={jeeMains2023Items} />
    </div>
  );
};


export default JeeMains2023
