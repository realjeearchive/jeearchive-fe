import type { Metadata } from "next";
import { ChapterWiseQuestionsClient } from "./ChapterWiseQuestionsClient";

export const metadata: Metadata = {
  title: "JEE Chapter-wise Practice Tests - Physics, Chemistry, Math | JEE Archive",
  description:
    "Practice JEE Main & Advanced chapter-wise questions with NTA interface. Topic-wise PYQs for Physics, Chemistry, and Mathematics. Free online mock tests with instant results.",
  alternates: {
    canonical: "https://jeearchive.com/chapter-wise-questions",
  },
  openGraph: {
    title: "JEE Chapter-wise Practice - Free Topic-wise Mock Tests | JEE Archive",
    description:
      "Master every JEE chapter with topic-wise practice tests. Physics, Chemistry, Math - all chapters covered with real NTA interface.",
    url: "https://jeearchive.com/chapter-wise-questions",
    type: "website",
  },
};

export default function ChapterWiseQuestionsPage() {
  return <ChapterWiseQuestionsClient />;
}