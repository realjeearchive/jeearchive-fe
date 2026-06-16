
import type { Metadata } from "next";
import { SolutionPageClient } from "./SolutionPageClient";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { testId } = await params;
  return {
    title: `Solutions - JEE Archive`,
    description:
      "View detailed solutions for your JEE mock test. Step-by-step explanations, correct answers, and performance insights for every question.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SolutionPage(props: PageProps) {
  const { testId } = await props.params;
  return <SolutionPageClient testId={testId} />;
}