// src/app/(dashboard)/previous-year-questions/jee-mains/[year]/page.tsx
'use client';

import { useEffect, use } from 'react';
import TestListSection from "@/components/dashboard/TestListSection/TestListSection";
import Styles from "../jeeMains.module.css";
import { usePaperStore } from "@/store/paperStore";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeMainsYearPage(props: YearPageProps) {
  // 1. Unwrap params using React.use()
  const { year } = use(props.params);

  // 2. Connect to the Zustand Store
  const { papers, isLoading, error, getPapers } = usePaperStore();

  // 3. Fetch papers
  useEffect(() => {
    if (year) {
      getPapers(year);
    }
  }, [year, getPapers]);

  // 4. Transform API data for TestListSection
  // Updated to include 'meta' and 'href' properly
  const formattedItems = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Main ${paper.year} ${paper.date} ${paper.month} ${paper.shift}`,
    // Meta: Display helpful info like "Full Test • 300 Marks"
    meta: `Full Test • ${paper.totalMarks} Marks`,
    // Href: Points to the specific test overview page
    href: `/previous-year-questions/jee-mains/${year}/tests/${paper.id}` 
  }));

  // 5. Loading State
  if (isLoading) {
    return (
      <div className={Styles.jeeMainsPage}>
        <div className={Styles.loadingContainer}>
           <p>Loading papers...</p>
        </div>
      </div>
    );
  }

  // 6. Error State
  if (error) {
    return (
      <div className={Styles.jeeMainsPage}>
        <div className={Styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={() => getPapers(year)} className={Styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // 7. Empty State
  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.jeeMainsPage}>
        <p className={Styles.emptyMessage}>
          Papers for JEE Main {year} are not available yet.
        </p>
      </div>
    );
  }

  // 8. Success State
  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection heading={`JEE Main ${year}`} items={formattedItems} />
    </div>
  );
}