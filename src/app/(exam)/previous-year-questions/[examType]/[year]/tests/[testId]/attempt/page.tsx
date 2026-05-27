import type { Metadata } from "next";
import { AttemptClient } from "./AttemptClient";

interface AttemptPageProps {
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export async function generateMetadata({ params }: AttemptPageProps): Promise<Metadata> {
  const { examType, year } = await params;
  const displayTitle = examType === "jee-advanced" ? "JEE Advanced" : "JEE Main";
  
  return {
    title: `Attempt ${displayTitle} ${year} Mock Test | JEE Archive`,
    description: `Currently attempting ${displayTitle} ${year} mock test with real NTA interface. Timer running, questions displayed in actual exam format.`,
    robots: {
      index: false, // Never index active test sessions
      follow: false,
    },
  };
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { examType, year, testId } = await props.params;
  return <AttemptClient examType={examType} year={year} testId={testId} />;
}