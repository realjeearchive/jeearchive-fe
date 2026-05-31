import type { Metadata } from "next";
import { SingleTestAnalysisClient } from "./SingleTestAnalysisClient";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { testId } = await params;
  return {
    title: `Test Analysis - JEE Archive`,
    description: `Detailed performance analysis for your JEE mock test. View scores, accuracy, subject breakdown, and question-wise insights.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SingleTestAnalysisPage(props: PageProps) {
  const { testId } = await props.params;
  return <SingleTestAnalysisClient testId={testId} />;
}