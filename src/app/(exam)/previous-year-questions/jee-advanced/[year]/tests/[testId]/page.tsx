// src/app/(exam)/previous-year-questions/jee-advanced/[year]/tests/[testId]/page.tsx
'use client';

import { use, useEffect, useMemo } from 'react';
import { usePaperStore } from "@/store/paperStore";
import { TestOverviewPageClient } from "./testOverviewPageClient";
import { Loader } from "@/components/ui/loader";

interface TestOverviewPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default function TestOverviewPage(props: TestOverviewPageProps) {
  const { year, testId } = use(props.params);
  const { papers, getPapers, isLoading } = usePaperStore();

  const selectedPaper = useMemo(() => {
    return papers.find((p) => p.id === testId);
  }, [papers, testId]);

  useEffect(() => {
    if (papers.length === 0 && !isLoading) {
       getPapers(year, 'JEE_ADVANCED');
    }
  }, [papers.length, year, getPapers, isLoading]);

  if (isLoading || (!selectedPaper && papers.length === 0)) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader label="Loading Test Details..." size="h-6 w-6" />
      </div>
    );
  }

  if (!selectedPaper) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Test not found. Please go back to the list.
      </div>
    );
  }

  const title = `JEE Advanced ${selectedPaper.year} ${selectedPaper.date || ''} (${selectedPaper.shift || 'Paper'})`;

  return (
    <TestOverviewPageClient
      summaryTitle={title}
      sectionsCount={3} 
      paperId={testId}
      year={year}
    />
  );
}