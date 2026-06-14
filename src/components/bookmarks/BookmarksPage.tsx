"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Loader } from "@/components/ui/loader";
import Latex from "@/components/testPlayer/Latex/Latex";
import { Search, BookmarkMinus, Play } from "lucide-react";
import Styles from "./bookmarks.module.css";

import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";

// --- Dynamic Bookmark Icon SVG (Matches Chapter-wise aesthetic) ---
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <path 
        d="M10 6C10 4.89543 10.8954 4 12 4H20C21.1046 4 22 4.89543 22 6V26.5C22 27.3912 21.0371 27.9482 20.2785 27.493L16 24.925L11.7215 27.493C10.9629 27.9482 10 27.3912 10 26.5V6Z" 
        fill="#F59E0B" fillOpacity="0.15" 
        stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="13" y1="10" x2="19" y2="10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="14" x2="17" y2="14" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const prepareForPreview = (html: string) => {
  if (!html) return "";
  let text = html.replace(/<[^>]*>?/gm, "").trim();
  text = text.replace(/\$\$/g, "$").replace(/\\\[/g, "$").replace(/\\\]/g, "$");
  return text;
};

export default function BookmarksPage() {
  const { bookmarks, isLoading, error, fetchBookmarks, removeBookmark } = useBookmarkStore();
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
        const plainText = q.content ? prepareForPreview(q.content).toLowerCase() : "";
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
        style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "85vh" }}
        aria-label="Loading bookmarks"
      >
        <Loader label="Loading your saved questions..." />
      </main>
    );
  }

  if (error && !isRateLimited) {
    return (
      <main
        style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "85vh", color: "var(--color-error-main)" }}
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
          
          {/* ─── LEFT SIDEBAR (Exactly matching Chapter-wise) ─────────────────────────── */}
          <aside className={Styles.leftSidebar} aria-label="Bookmarks filters">
            
            {/* Header Block */}
            <div className={Styles.headerBlock}>
              <div className={`${Styles.graphicIconContainer} ${Styles.iconContainerBookmark}`}>
                <BookmarkIcon />
              </div>

              <div className={Styles.headerTextGroup}>
                <h1 className={Styles.cardTitle}>Bookmarks</h1>
                <div className={Styles.metaInfoRow}>
                  <span>JEE Archive</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>{bookmarks.length} Saved</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>Questions</span>
                </div>
              </div>
            </div>

            {/* Practice Button */}
            {bookmarks.length > 0 && (
              <Link
                href="/bookmarks/practice"
                className={Styles.practiceBtn}
                aria-label="Practice all bookmarked questions"
              >
                <Play size={16} fill="currentColor" strokeWidth={1} aria-hidden="true" />
                Practice All
              </Link>
            )}

            {/* Search */}
            <div className={Styles.searchWrapper}>
              <span className={Styles.listLabel}>SEARCH</span>
              <div className={Styles.searchContainer}>
                <Search size={16} className={Styles.searchIcon} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className={Styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search bookmarked questions"
                />
              </div>
            </div>

            {/* Divisions Tabs Grid (Subject Filters) */}
            <nav className={Styles.divisionsListContainer} aria-label="Filter by subject">
              <span className={Styles.listLabel}>FILTER BY SUBJECT</span>
              
              <div className={Styles.divisionsGrid}>
                {["All", "Physics", "Chemistry", "Mathematics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubjectFilter(tab)}
                    className={`${Styles.divisionTabBtn} ${activeSubjectFilter === tab ? Styles.divisionTabActive : ""}`}
                    aria-current={activeSubjectFilter === tab ? "true" : undefined}
                  >
                    <span className={Styles.divisionNameText}>{tab}</span>
                    <span className={Styles.divisionMetaText}>
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

          {/* ─── RIGHT CONTENT ─────────────────────────────────────────────────── */}
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