'use client';

import { use, useEffect, useMemo } from 'react';
import { usePaperStore } from "@/store/paperStore";
import { TestOverviewPageClient } from "./testOverviewPageClient";
import { Loader } from "@/components/ui/loader";

interface TestOverviewPageProps {
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export default function TestOverviewPage(props: TestOverviewPageProps) {
  const { examType, year, testId } = use(props.params);
  const { papers, getPapers, isLoading } = usePaperStore();

  // Convert URL param to API enum
  const apiExamType = examType === 'jee-advanced' ? 'JEE_ADVANCED' : 'JEE_MAIN';

  const selectedPaper = useMemo(() => {
    return papers.find((p) => p.id === testId);
  }, [papers, testId]);

  useEffect(() => {
    if (papers.length === 0 && !isLoading) {
       getPapers(year, apiExamType);
    }
  }, [papers.length, year, getPapers, isLoading, apiExamType]);

  if (isLoading || (!selectedPaper && papers.length === 0)) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader label="Loading Test Details..." size="h-6 w-6" />
      </div>
    );
  }

  if (!selectedPaper) {
    return <div className="p-8 text-red-500 text-center">Test not found.</div>;
  }

  const title = `${examType === 'jee-advanced' ? 'JEE Advanced' : 'JEE Main'} ${selectedPaper.year} ${selectedPaper.date || ''} (${selectedPaper.shift || 'Paper'})`;

  return (
    <TestOverviewPageClient
      summaryTitle={title}
      sectionsCount={3} 
      paperId={testId}
      year={year}
      examType={examType} // Pass this down
    />
  );
}