import type { Metadata } from "next";
import { TestSubmissionSummary } from "@/components/testPlayer/TestSubmissionSummary/TestSubmissionSummary";

interface SubmitPageProps {
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export async function generateMetadata({ params }: SubmitPageProps): Promise<Metadata> {
  const { examType, year } = await params;
  const displayTitle = examType === "jee-advanced" ? "JEE Advanced" : "JEE Main";
  
  return {
    title: `${displayTitle} ${year} Test Submitted - Results | JEE Archive`,
    description: `View your ${displayTitle} ${year} mock test results. Check score, correct answers, and detailed solutions for each question.`,
    robots: {
      index: false, // Don't index personal results
      follow: false,
    },
  };
}

export default async function SubmitPage(props: SubmitPageProps) {
  await props.params;
  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <TestSubmissionSummary />
    </main>
  );
}