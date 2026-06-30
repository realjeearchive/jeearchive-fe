import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEE Archive - Free JEE Main & Advanced Mock Tests with NTA Interface",
  description:
    "Start practicing for JEE Main 2026 with the real NTA interface. Access 10,000+ chapter-wise PYQs, mock tests, previous year papers, instant results, and detailed performance analytics for free.",
  alternates: {
    canonical: "https://jeearchive.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Page() {
  redirect("/login");
}