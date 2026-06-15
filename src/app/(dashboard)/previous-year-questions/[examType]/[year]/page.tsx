import type { Metadata } from "next";
export const runtime = "edge";
import { YearPageClient } from "./YearPageClient";

interface YearPageProps {
  params: Promise<{ examType: string; year: string }>;
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { examType, year } = await params;
  const isMains = examType === "jee-mains";
  const displayTitle = isMains ? "JEE Main" : "JEE Advanced";

  return {
    title: `${displayTitle} ${year} Previous Year Papers - PYQ Mock Tests | JEE Archive`,
    description: `Practice ${displayTitle} ${year} previous year question papers with real NTA interface. All shifts, instant results, and detailed solutions. Free online JEE PYQ mock tests.`,
    alternates: {
      canonical: `https://jeearchive.com/previous-year-questions/${examType}/${year}`,
    },
    openGraph: {
      title: `${displayTitle} ${year} PYQ Papers - Free Mock Tests | JEE Archive`,
      description: `Attempt ${displayTitle} ${year} all shift papers with NTA interface. Instant results, detailed solutions, and performance analytics.`,
      url: `https://jeearchive.com/previous-year-questions/${examType}/${year}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function YearPage(props: YearPageProps) {
  const { examType, year } = await props.params;
  return <YearPageClient examType={examType} year={year} />;
}