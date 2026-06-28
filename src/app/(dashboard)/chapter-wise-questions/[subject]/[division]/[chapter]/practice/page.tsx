import { Suspense } from "react";
import type { Metadata } from "next";
 
import { chapterConfig } from "@/features/chapterWise/config";
import { PracticePageClient } from "./PracticePageClient";
import { Loader } from "@/components/ui/loader";

interface PracticePageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

// 🔥 NEW: Utility to cleanly format slugs into Title Case
const formatSlugToTitle = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export async function generateMetadata({ params }: PracticePageProps): Promise<Metadata> {
  const { subject, division, chapter } = await params;

  const divisionChapters = chapterConfig[division] || [];
  
  // 🔥 FIX: Fallback to the formatted title if not found in config
  const exactChapterName = divisionChapters.find((c) => c.id === chapter)?.title || formatSlugToTitle(chapter);

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
    <Suspense 
      fallback={
        <main
          className="flex h-screen items-center justify-center bg-[var(--bg-main)]"
          aria-label="Loading practice questions"
        >
          <Loader label="Initializing practice session..." />
        </main>
      }
    >
      <PracticePageClient subject={subject} division={division} chapter={chapter} />
    </Suspense>
  );
}