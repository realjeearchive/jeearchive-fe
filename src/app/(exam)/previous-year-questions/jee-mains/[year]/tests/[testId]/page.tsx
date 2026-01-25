// src/app/(dashboard)/previous-year-questions/jee-mains/[year]/tests/[testId]/page.tsx
'use client';

import { use, useEffect, useMemo } from 'react';
import { usePaperStore } from "@/store/paperStore";
import { TestOverviewPageClient } from "./testOverviewPageClient";
import { Loader } from "@/components/ui/loader";

interface TestOverviewPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default function TestOverviewPage(props: TestOverviewPageProps) {
  // 1. Unwrap params
  const { year, testId } = use(props.params);

  // 2. Connect to Store
  const { papers, getPapers, isLoading } = usePaperStore();

  // 3. DERIVED STATE
  const selectedPaper = useMemo(() => {
    return papers.find((p) => p.id === testId);
  }, [papers, testId]);

  // 4. Data Fetching Effect
  useEffect(() => {
    if (papers.length === 0 && !isLoading) {
       getPapers(year);
    }
  }, [papers.length, year, getPapers, isLoading]);

  // 5. Loading State
  if (isLoading || (!selectedPaper && papers.length === 0)) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader label="Loading Paper Details..." size="h-6 w-6" />
      </div>
    );
  }

  // 6. Error/Not Found State
  if (!selectedPaper) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Paper not found. Please go back to the list.
      </div>
    );
  }

  // 7. Success State
  const title = `JEE Main ${selectedPaper.year} - ${selectedPaper.date} ${selectedPaper.month} (${selectedPaper.shift})`;

  return (
    <TestOverviewPageClient
      summaryTitle={title}
      sectionsCount={3}
      // Pass "#" because the Client Component now handles navigation dynamically
      // FIX: Pass the missing props required for the Backend Sync
      paperId={testId} 
      year={year}
    />
  );
}