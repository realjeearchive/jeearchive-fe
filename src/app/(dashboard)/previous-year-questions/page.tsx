import type { Metadata } from "next";
 
import { PreviousYearQuestionsClient } from "./PreviousYearQuestionsClient";

export const metadata: Metadata = {
  title: "JEE Previous Year Question Papers - PYQ Mock Tests | JEE Archive",
  description:
    "Practice JEE Main & Advanced previous year question papers (PYQs) with real NTA interface. Access 2012-2026 papers, chapter-wise solutions, and instant results. Free online mock tests.",
  alternates: {
    canonical: "https://jeearchive.com/previous-year-questions",
  },
  openGraph: {
    title: "JEE Previous Year Papers - Free PYQ Mock Tests | JEE Archive",
    description:
      "Practice 10+ years of JEE Main & Advanced PYQs with real NTA interface. Chapter-wise solutions, instant results, and detailed analytics.",
    url: "https://jeearchive.com/previous-year-questions",
    type: "website",
  },
};

export default function PreviousYearQuestionsPage() {
  return <PreviousYearQuestionsClient />;
}