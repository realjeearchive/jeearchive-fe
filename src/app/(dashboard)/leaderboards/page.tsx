import type { Metadata } from "next";
import Leaderboard from "@/components/leaderboard/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard - JEE Archive",
  description:
    "JEE Main & Advanced leaderboard. Compare your scores, percentile, and rank with other JEE aspirants across India.",
  openGraph: {
    title: "JEE Archive Leaderboard - Compare Your JEE Scores",
    description:
      "See where you stand among thousands of JEE aspirants. Real-time rankings, percentile comparisons, and score leaderboards.",
  },
  robots: {
    index: true, // Index this page for SEO when unlocked
    follow: true,
  },
};

const Leaderboards = () => {
  return (
    <main className="overflow-hidden h-[94vh]" aria-label="Leaderboard">
      <Leaderboard />
    </main>
  );
};

export default Leaderboards;