// app/previous-year-questions/jee-mains/[year]/page.tsx
import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from "../jeeMains.module.css";
import { jeeMainsYearConfig } from "@/features/tests/year-config";


interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default async function JeeMainsYearPage(props: YearPageProps) {
  const { year } = await props.params; // ← important

  const items = jeeMainsYearConfig[year];

  if (!items) {
    return (
      <div className={Styles.jeeMainsPage}>
        <p className={Styles.emptyMessage}>
          Papers for JEE Main {year} are not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection heading={`JEE Main ${year}`} items={items} />
    </div>
  );
}
