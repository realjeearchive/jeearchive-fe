"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Loader } from "@/components/ui/loader";
import Latex from "@/components/testPlayer/Latex/Latex";
import { Search, BookmarkMinus, Bookmark, Play } from "lucide-react";
import Styles from "./bookmarks.module.css";

import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";

const prepareForPreview = (html: string) => {
  if (!html) return "";
  let text = html.replace(/<[^>]*>?/gm, "").trim();
  text = text.replace(/\$\$/g, "$").replace(/\\\[/g, "$").replace(/\\\]/g, "$");
  return text;
};

export default function BookmarksPage() {
  const { bookmarks, isLoading, error, fetchBookmarks, removeBookmark } =
    useBookmarkStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>("All");

  const { isRateLimited } = useRateLimitStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((q) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const plainText = q.content
          ? prepareForPreview(q.content).toLowerCase()
          : "";
        if (!plainText.includes(query)) return false;
      }
      if (activeSubjectFilter !== "All") {
        if (q.subject !== activeSubjectFilter) return false;
      }
      return true;
    });
  }, [bookmarks, searchQuery, activeSubjectFilter]);

  if (isLoading && !isRateLimited) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "85vh",
        }}
        aria-label="Loading bookmarks"
      >
        <Loader label="Loading your saved questions..." />
      </main>
    );
  }

  if (error && !isRateLimited) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "85vh",
          color: "#EF4444",
        }}
        aria-label="Bookmarks error"
      >
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <>
      <RateLimitModal />

      <div className={Styles.pageContainer}>
        <div className={Styles.splitLayout}>
          {/* LEFT SIDEBAR */}
          <aside className={Styles.leftSidebar} aria-label="Bookmarks filters">
            <div className={Styles.cardHeader}>
              <div className={Styles.iconSquare} aria-hidden="true">
                <Bookmark size={20} />
              </div>
              <div>
                <h1 className={Styles.cardTitle}>Bookmarks</h1>
                <p className={Styles.cardSubtitle}>
                  {bookmarks.length} Saved Questions
                </p>
              </div>
            </div>

            {/* Practice Button */}
            {bookmarks.length > 0 && (
              <Link
                href="/bookmarks/practice"
                className={Styles.practiceBtn}
                aria-label="Practice all bookmarked questions"
              >
                <Play size={14} fill="currentColor" aria-hidden="true" />
                Practice All
              </Link>
            )}

            {/* Search */}
            <div className={Styles.searchWrapper}>
              <span className={Styles.listLabel}>Search</span>
              <div className={Styles.searchContainer}>
                <Search size={15} className={Styles.searchIcon} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search saved questions..."
                  className={Styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search bookmarked questions"
                />
              </div>
            </div>

            {/* Subject Filters */}
            <nav className={Styles.filtersContainer} aria-label="Filter by subject">
              <span className={Styles.listLabel}>Filter by Subject</span>
              <div className={Styles.filterList}>
                {["All", "Physics", "Chemistry", "Mathematics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubjectFilter(tab)}
                    className={`${Styles.filterRowItem} ${activeSubjectFilter === tab ? Styles.filterRowActive : ""}`}
                    aria-pressed={activeSubjectFilter === tab}
                    aria-label={`${tab} - ${tab === "All" ? bookmarks.length : bookmarks.filter((q) => q.subject === tab).length} questions`}
                  >
                    <span className={Styles.filterNameText}>{tab}</span>
                    <span className={Styles.filterMetaText}>
                      {tab === "All"
                        ? bookmarks.length
                        : bookmarks.filter((q) => q.subject === tab).length}{" "}
                      questions
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* RIGHT CONTENT */}
          <main className={Styles.rightContent} aria-label="Bookmarked questions list">
            <div className={Styles.scrollContentWrapper}>
              <div className={Styles.listHeader}>
                <h2 className={Styles.listTitle}>
                  {activeSubjectFilter === "All"
                    ? "ALL BOOKMARKS"
                    : `${activeSubjectFilter.toUpperCase()} — BOOKMARKS`}
                </h2>
                <span className={Styles.listCount}>
                  {filteredBookmarks.length} questions
                </span>
              </div>

              {filteredBookmarks.length > 0 ? (
                <div className={Styles.questionsList} role="list">
                  {filteredBookmarks.map((q, index) => {
                    const plainTextContent = prepareForPreview(q.content);
                    const isMulti = q.type.toLowerCase().includes("multi");
                    const uiType = isMulti
                      ? "Multiple Choice"
                      : q.type === "Numerical"
                      ? "Numerical"
                      : "Single Choice";

                    return (
                      <Link
                        key={q.id}
                        href={`/bookmarks/practice?q=${q.id}`}
                        className={Styles.questionRow}
                        role="listitem"
                        aria-label={`Question ${index + 1}: ${plainTextContent.substring(0, 80)}`}
                      >
                        <div className={Styles.questionLeft}>
                          <span className={Styles.qNumber}>{index + 1}.</span>
                          <span className={Styles.qText}>
                            {plainTextContent.length === 0 ? (
                              <span className={Styles.imagePlaceholder}>
                                Image Based Question
                              </span>
                            ) : (
                              <Latex>{plainTextContent}</Latex>
                            )}
                          </span>
                        </div>

                        <div className={Styles.questionRight}>
                          <span className={`${Styles.typeTag} ${Styles.desktopOnly}`}>
                            {uiType}
                          </span>
                          <span className={Styles.subjectTag}>{q.subject}</span>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeBookmark(q.id);
                            }}
                            className={Styles.removeBtn}
                            title="Remove Bookmark"
                            aria-label={`Remove question ${index + 1} from bookmarks`}
                          >
                            <BookmarkMinus size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className={Styles.emptyState}>
                  <BookmarkMinus size={40} className={Styles.emptyIcon} aria-hidden="true" />
                  <p className={Styles.emptyTitle}>No bookmarks found</p>
                  <p className={Styles.emptySubtitle}>
                    {searchQuery || activeSubjectFilter !== "All"
                      ? "Try adjusting your search criteria or filter choices."
                      : "Questions you bookmark during chapterwise practice will appear here."}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}