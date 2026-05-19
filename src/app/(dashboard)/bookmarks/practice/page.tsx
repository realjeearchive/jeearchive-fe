"use client";

import React, { Suspense } from "react";
import BookmarkPracticeContent from "@/components/bookmarks/BookmarkPracticeContent";

export default function BookmarkPracticePage() {
  return (
    <Suspense fallback={
      <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--dashboard-background-color)" }}>
        <div className="w-10 h-10 border-4 border-[#f59e0b33] border-t-[#f59e0b] rounded-full animate-spin" />
      </div>
    }>
      <BookmarkPracticeContent />
    </Suspense>
  );
}