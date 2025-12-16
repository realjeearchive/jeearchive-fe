import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from './jeeAdvanced.module.css';


const JeeAdvanced = () => {
  type JeeAdvanced = {
  id: string;
  title: string;
  href: string;
  meta: string;
};


  const jeeAdvancedItems: JeeAdvanced[] = [
  { id: "2025-p1", title: "JEE Advanced 2025 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2025/paper-1" },
  { id: "2025-p2", title: "JEE Advanced 2025 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2025/paper-2" },

  { id: "2024-p1", title: "JEE Advanced 2024 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2024/paper-1" },
  { id: "2024-p2", title: "JEE Advanced 2024 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2024/paper-2" },

  { id: "2023-p1", title: "JEE Advanced 2023 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2023/paper-1" },
  { id: "2023-p2", title: "JEE Advanced 2023 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2023/paper-2" },

  { id: "2022-p1", title: "JEE Advanced 2022 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2022/paper-1" },
  { id: "2022-p2", title: "JEE Advanced 2022 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2022/paper-2" },

  { id: "2021-p1", title: "JEE Advanced 2021 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2021/paper-1" },
  { id: "2021-p2", title: "JEE Advanced 2021 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2021/paper-2" },

  { id: "2020-p1", title: "JEE Advanced 2020 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2020/paper-1" },
  { id: "2020-p2", title: "JEE Advanced 2020 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2020/paper-2" },

  { id: "2019-p1", title: "JEE Advanced 2019 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2019/paper-1" },
  { id: "2019-p2", title: "JEE Advanced 2019 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2019/paper-2" },

  { id: "2018-p1", title: "JEE Advanced 2018 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2018/paper-1" },
  { id: "2018-p2", title: "JEE Advanced 2018 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2018/paper-2" },

  { id: "2017-p1", title: "JEE Advanced 2017 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2017/paper-1" },
  { id: "2017-p2", title: "JEE Advanced 2017 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2017/paper-2" },

  { id: "2016-p1", title: "JEE Advanced 2016 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2016/paper-1" },
  { id: "2016-p2", title: "JEE Advanced 2016 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2016/paper-2" },

  { id: "2015-p1", title: "JEE Advanced 2015 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2015/paper-1" },
  { id: "2015-p2", title: "JEE Advanced 2015 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2015/paper-2" },

  { id: "2014-p1", title: "JEE Advanced 2014 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2014/paper-1" },
  { id: "2014-p2", title: "JEE Advanced 2014 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2014/paper-2" },

  { id: "2013-p1", title: "JEE Advanced 2013 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2013/paper-1" },
  { id: "2013-p2", title: "JEE Advanced 2013 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2013/paper-2" },

  { id: "2012-p1", title: "JEE Advanced 2012 Paper 1", meta: "Paper 1 • Morning Shift", href: "/previous-year-questions/jee-advanced/2012/paper-1" },
  { id: "2012-p2", title: "JEE Advanced 2012 Paper 2", meta: "Paper 2 • Afternoon Shift", href: "/previous-year-questions/jee-advanced/2012/paper-2" },
];



  return (
    <div className={Styles.jeeAdvancedPage}>
      <TestListSection heading="Jee Advanced" items={jeeAdvancedItems} />
    </div>
  );
};


export default JeeAdvanced
