import type { Metadata } from "next";
import { chapterConfig } from "@/features/chapterWise/config";
import { ChapterDashboardPageClient } from "./ChapterDashboardPageClient";

interface ChapterPageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { subject, division, chapter } = await params;

  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName = divisionChapters.find((c) => c.id === chapter)?.title || chapter;

  const subjectLabel =
    subject === "maths" ? "Mathematics" : subject.charAt(0).toUpperCase() + subject.slice(1);

  return {
    title: `${exactChapterName} JEE Practice Test - Chapter-wise PYQs | JEE Archive`,
    description: `Practice ${exactChapterName} JEE Main & Advanced questions with NTA interface. Topic-wise PYQs, instant results, and detailed solutions for ${subjectLabel}.`,
    alternates: {
      canonical: `https://jeearchive.com/chapter-wise-questions/${subject}/${division}/${chapter}`,
    },
    openGraph: {
      title: `${exactChapterName} - JEE Chapter-wise Mock Test | JEE Archive`,
      description: `Master ${exactChapterName} for JEE with chapter-wise practice tests. Real NTA interface, PYQs, and detailed solutions.`,
      url: `https://jeearchive.com/chapter-wise-questions/${subject}/${division}/${chapter}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ChapterDashboardPage(props: ChapterPageProps) {
  const { subject, division, chapter } = await props.params;
  return (
    <ChapterDashboardPageClient
      subject={subject}
      division={division}
      chapter={chapter}
    />
  );
}