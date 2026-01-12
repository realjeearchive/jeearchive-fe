// src/app/(dashboard)/previous-year-questions/jee-mains/[year]/tests/[testId]/page.tsx
'use client';

import { use, useEffect, useMemo } from 'react';
import { usePaperStore } from "@/store/paperStore";
import { TestOverviewPageClient } from "./testOverviewPageClient";

interface TestOverviewPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default function TestOverviewPage(props: TestOverviewPageProps) {
  // 1. Unwrap params
  const { year, testId } = use(props.params);

  // 2. Connect to Store
  const { papers, getPapers, isLoading } = usePaperStore();

  // 3. DERIVED STATE (Fix: No useState, no useEffect for selection)
  // We calculate this immediately. If 'papers' updates, this updates.
  const selectedPaper = useMemo(() => {
    return papers.find((p) => p.id === testId);
  }, [papers, testId]);

  // 4. Data Fetching Effect (Only runs if data is MISSING)
  useEffect(() => {
    // Only fetch if we have no papers and we aren't already loading
    if (papers.length === 0 && !isLoading) {
       getPapers(year);
    }
  }, [papers.length, year, getPapers, isLoading]);

  // 5. Loading State
  // We show loading if the global loader is true OR if we have no paper yet
  if (isLoading || (!selectedPaper && papers.length === 0)) {
    return (
      <div style={{ padding: '2rem', color: '#888' }}>
        Loading Test Details...
      </div>
    );
  }

  // 6. Error/Not Found State
  if (!selectedPaper) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Test not found. Please go back to the list.
      </div>
    );
  }

  // 7. Success State
  const attemptHref = `/previous-year-questions/jee-mains/${year}/tests/${testId}/attempt`;
  
  const title = `JEE Main ${selectedPaper.year} - ${selectedPaper.date} ${selectedPaper.month} (${selectedPaper.shift})`;

  return (
    <TestOverviewPageClient
      summaryTitle={title}
      sectionsCount={3} 
      attemptHref={attemptHref}
    />
  );
}