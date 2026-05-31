import type { Metadata } from "next";
import { Suspense } from "react";
import BookmarkPracticeContent from "@/components/bookmarks/BookmarkPracticeContent";

export const metadata: Metadata = {
  title: "Practice Bookmarks - JEE Archive",
  description: "Practice your saved JEE questions. Review bookmarked questions with real NTA interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookmarkPracticePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--dashboard-background-color)",
          }}
          aria-label="Loading bookmarks practice"
          role="status"
        >
          <div className="w-10 h-10 border-4 border-[#f59e0b33] border-t-[#f59e0b] rounded-full animate-spin" />
        </div>
      }
    >
      <BookmarkPracticeContent />
    </Suspense>
  );
}