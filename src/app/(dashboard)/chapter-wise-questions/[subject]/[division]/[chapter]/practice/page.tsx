// src/app/(dashboard)/chapter-wise-questions/[subject]/[division]/[chapter]/practice/page.tsx
import type { Metadata } from "next";
export const runtime = "edge";
import { chapterConfig } from "@/features/chapterWise/config";
import { PracticePageClient } from "./PracticePageClient";

interface PracticePageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

export async function generateMetadata({ params }: PracticePageProps): Promise<Metadata> {
  const { subject, division, chapter } = await params;

  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName = divisionChapters.find((c) => c.id === chapter)?.title || chapter;

  return {
    title: `Practice ${exactChapterName} - JEE Chapter-wise Mock Test | JEE Archive`,
    description: `Currently practicing ${exactChapterName} questions for JEE. Real NTA interface, timer-based test, and detailed solutions after submission.`,
    robots: {
      index: false, // Don't index active practice sessions
      follow: false,
    },
  };
}

export default async function PracticePage(props: PracticePageProps) {
  const { subject, division, chapter } = await props.params;
  return (
    <PracticePageClient subject={subject} division={division} chapter={chapter} />
  );
}