"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Loader } from "@/components/ui/loader";
import Latex from "@/components/testPlayer/Latex/Latex";
import { Search, BookmarkMinus, Bookmark, Play } from "lucide-react";
import Styles from "./bookmarks.module.css";

// 🚨 NEW: Import Rate Limit Modal and Store
import { RateLimitModal } from '@/components/ui/RateLimitModal/RateLimitModal';
import { useRateLimitStore } from '@/store/useRateLimitStore';

const prepareForPreview = (html: string) => {
  if (!html) return "";
  let text = html.replace(/<[^>]*>?/gm, '').trim();
  text = text.replace(/\$\$/g, '$').replace(/\\\[/g, '$').replace(/\\\]/g, '$');
  return text;
};

export default function BookmarksPage() {
  const { bookmarks, isLoading, error, fetchBookmarks, removeBookmark } = useBookmarkStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>("All");

  // 🚨 NEW: Listen to rate limit state
  const { isRateLimited } = useRateLimitStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((q) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const plainText = q.content ? prepareForPreview(q.content).toLowerCase() : '';
        if (!plainText.includes(query)) return false;
      }
      if (activeSubjectFilter !== "All") {
        if (q.subject !== activeSubjectFilter) return false;
      }
      return true;
    });
  }, [bookmarks, searchQuery, activeSubjectFilter]);

  // 🚨 FIX: Only show loader if NOT rate limited
  if (isLoading && !isRateLimited) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
        <Loader label="Loading your saved questions..." />
      </div>
    );
  }

  // 🚨 FIX: Only show error if NOT rate limited
  if (error && !isRateLimited) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', color: '#EF4444' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      {/* 🚨 THE RATE LIMIT MODAL */}
      <RateLimitModal />

      <div className={Styles.pageContainer}>
        <div className={Styles.splitLayout}>
          
          {/* LEFT SIDEBAR: Header & Filters */}
          <aside className={Styles.leftSidebar}>
            <div className={Styles.cardHeader}>
              <div className={Styles.iconSquare}>
                <Bookmark size={20} />
              </div>
              <div>
                <h1 className={Styles.cardTitle}>Bookmarks</h1>
                <p className={Styles.cardSubtitle}>{bookmarks.length} Saved Questions</p>
              </div>
            </div>

            {/* Practice Button */}
            {bookmarks.length > 0 && (
              <Link 
                href="/bookmarks/practice"
                className={Styles.practiceBtn}
              >
                <Play size={14} fill="currentColor" />
                Practice All
              </Link>
            )}

            {/* Search */}
            <div className={Styles.searchWrapper}>
              <span className={Styles.listLabel}>Search</span>
              <div className={Styles.searchContainer}>
                <Search size={15} className={Styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search saved questions..." 
                  className={Styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Subject Filters */}
            <div className={Styles.filtersContainer}>
              <span className={Styles.listLabel}>Filter by Subject</span>
              <div className={Styles.filterList}>
                {["All", "Physics", "Chemistry", "Mathematics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubjectFilter(tab)}
                    className={`${Styles.filterRowItem} ${activeSubjectFilter === tab ? Styles.filterRowActive : ''}`}
                  >
                    <span className={Styles.filterNameText}>{tab}</span>
                    <span className={Styles.filterMetaText}>
                      {tab === "All" 
                        ? bookmarks.length 
                        : bookmarks.filter(q => q.subject === tab).length} questions
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT: Questions List */}
          <main className={Styles.rightContent}>
            <div className={Styles.scrollContentWrapper}>
              <div className={Styles.listHeader}>
                <h2 className={Styles.listTitle}>
                  {activeSubjectFilter === "All" ? "ALL BOOKMARKS" : `${activeSubjectFilter.toUpperCase()} — BOOKMARKS`}
                </h2>
                <span className={Styles.listCount}>{filteredBookmarks.length} questions</span>
              </div>

              {filteredBookmarks.length > 0 ? (
                <div className={Styles.questionsList}>
                  {filteredBookmarks.map((q, index) => {
                    const plainTextContent = prepareForPreview(q.content);
                    const isMulti = q.type.toLowerCase().includes("multi");
                    const uiType = isMulti ? "Multiple Choice" : q.type === "Numerical" ? "Numerical" : "Single Choice";
                    
                    return (
                      <Link 
                        key={q.id} 
                        href={`/bookmarks/practice?q=${q.id}`}
                        className={Styles.questionRow}
                      >
                        <div className={Styles.questionLeft}>
                          <span className={Styles.qNumber}>
                            {index + 1}.
                          </span>
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
                          <span className={Styles.subjectTag}>
                            {q.subject}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeBookmark(q.id);
                            }}
                            className={Styles.removeBtn}
                            title="Remove Bookmark"
                          >
                            <BookmarkMinus size={16} />
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className={Styles.emptyState}>
                  <BookmarkMinus size={40} className={Styles.emptyIcon} />
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