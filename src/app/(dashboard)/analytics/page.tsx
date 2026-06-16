import type { Metadata } from "next";
 
import { AnalyticsPageClient } from "./AnalyticsPageClient";

export const metadata: Metadata = {
  title: "Analytics - JEE Archive",
  description: "Detailed performance analytics for your JEE preparation. Track scores, accuracy, subject balance, and weakness analysis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}