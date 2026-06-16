import type { Metadata } from "next";
 
import { TestOverviewPageClient } from "./testOverviewPageClient";

interface TestOverviewPageProps {
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export async function generateMetadata({ params }: TestOverviewPageProps): Promise<Metadata> {
  const { examType, year, testId } = await params;
  const isAdvanced = examType === "jee-advanced";
  const displayTitle = isAdvanced ? "JEE Advanced" : "JEE Main";

  return {
    title: `${displayTitle} ${year} Mock Test Instructions | JEE Archive`,
    description: `Read instructions and start your ${displayTitle} ${year} mock test with real NTA interface. Check paper pattern, marking scheme, and navigation before beginning.`,
    alternates: {
      canonical: `https://jeearchive.com/previous-year-questions/${examType}/${year}/tests/${testId}`,
    },
    robots: {
      index: false, // Don't index instruction pages, only results
      follow: true,
    },
  };
}

export default async function TestOverviewPage(props: TestOverviewPageProps) {
  const { examType, year, testId } = await props.params;
  
  // You'll need to fetch paper data here or pass to client
  // For now, keeping your existing client-side logic
  return (
    <TestOverviewPageClient
      summaryTitle={`${examType === "jee-advanced" ? "JEE Advanced" : "JEE Main"} Overview`}
      sectionsCount={3}
      paperId={testId}
      year={year}
      examType={examType}
    />
  );
}