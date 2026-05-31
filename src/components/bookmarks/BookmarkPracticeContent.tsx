"use client";

import React, { useEffect, useState } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { ChapterWiseInterface, QuestionData } from "@/components/chapterwise/ChapterWiseInterface";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { FiBookmark } from "react-icons/fi";
import Styles from "./bookmarkPractice.module.css";

export default function BookmarkPracticeContent() {
  const router = useRouter();
  const { bookmarks, isLoading, error, fetchBookmarks } = useBookmarkStore();

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (bookmarks.length === 0 && !hasInitialized) {
      fetchBookmarks();
    }
  }, [bookmarks.length, fetchBookmarks, hasInitialized]);

  const sessionQuestions = React.useMemo(() => {
    if (isLoading || bookmarks.length === 0) return [];

    return bookmarks.map((q, index) => {
      const options = [];
      if (q.options) {
        if (q.options.optionAtext) options.push({ id: "A", text: q.options.optionAtext });
        if (q.options.optionBtext) options.push({ id: "B", text: q.options.optionBtext });
        if (q.options.optionCtext) options.push({ id: "C", text: q.options.optionCtext });
        if (q.options.optionDtext) options.push({ id: "D", text: q.options.optionDtext });
      }

      let sectionType = "Single Correct";
      if (q.type === "Numerical" || q.type === "Integer") sectionType = "Numerical";
      else if (q.type.toLowerCase().includes("multi")) sectionType = "Multiple Correct";
      else if (q.type === "Comprehension") sectionType = "Comprehension";

      return {
        id: q.id,
        number: index + 1,
        subject: q.subject || "Mixed",
        section: sectionType as unknown as QuestionData["section"],
        comprehensionContent: q.comprehensionContent,
        text: q.content,
        hasImage: false,
        imageUrl: undefined,
        options,
        correctAnswer: Array.isArray(q.correctAnswer)
          ? q.correctAnswer
          : [q.correctAnswer].filter(Boolean),
        status: "unattempted" as unknown as QuestionData["status"],
        userAnswer: null,
        isBookmarked: true,
        solution: q.solution?.text || "<p>No detailed solution available.</p>",
        stats: { userTime: "0s", avgTime: "--", accuracy: 0 },
        meta: {
          difficulty: "Medium" as const,
          marksPos: q.positiveMarks || 4,
          marksNeg: q.negativeMarks || 1,
        },
        chapter: q.chapter || "Saved Bookmark",
        topic: "Revision",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && sessionQuestions.length >= 0) {
      setHasInitialized(true);
    }
  }, [isLoading, sessionQuestions.length]);

  if (isLoading || (!hasInitialized && bookmarks.length > 0)) {
    return (
      <main className={Styles.fullScreenWrapper} aria-label="Loading bookmarks practice">
        <Loader label="Preparing practice arena..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className={Styles.errorState} aria-label="Bookmarks practice error">
        <p style={{ fontSize: "14px", fontWeight: 500 }} role="alert">
          {error}
        </p>
        <button
          onClick={() => router.push("/bookmarks")}
          className={Styles.errorBtn}
          aria-label="Go back to bookmarks"
        >
          Go Back
        </button>
      </main>
    );
  }

  if (hasInitialized && sessionQuestions.length === 0) {
    return (
      <main className={Styles.emptyState} aria-label="No bookmarks to practice">
        <FiBookmark size={32} color="#36312F" aria-hidden="true" />
        <p className={Styles.emptyText}>No bookmarks found to practice.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className={Styles.dashboardReturnBtn}
          aria-label="Return to dashboard"
        >
          Return to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className={Styles.fullScreenWrapper} aria-label="Bookmarks practice session">
      <ChapterWiseInterface
        questions={sessionQuestions}
        chapterName="My Bookmarks"
        subject="Mixed"
      />
    </main>
  );
}