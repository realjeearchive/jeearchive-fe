"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Loader } from "@/components/ui/loader";
import Latex from "@/components/testPlayer/Latex/Latex";
import { Search, BookmarkMinus, Bookmark, Play } from "lucide-react";
import Styles from "./bookmarks.module.css";

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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
        <Loader label="Loading your saved questions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', color: '#EF4444' }}>
        {error}
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      
      {/* Header Row */}
      <div className={Styles.headerRow}>
        <div className={Styles.titleInfo}>
          <h1>
            <Bookmark size={22} color="var(--dashboard-core-color)" />
            My Bookmarks
          </h1>
          <p>
            {bookmarks.length} saved questions across all subjects
          </p>
        </div>

        {bookmarks.length > 0 && (
          <Link 
            href="/bookmarks/practice"
            className={Styles.practiceBtn}
          >
            <Play size={14} fill="currentColor" style={{ marginRight: '4px' }} />
            Practice Bookmarks
          </Link>
        )}
      </div>

      {/* Controls Row */}
      <div className={Styles.controlsRow}>
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

        <div className={Styles.filterTabs}>
          {["All", "Physics", "Chemistry", "Mathematics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubjectFilter(tab)}
              className={`${Styles.filterBtn} ${activeSubjectFilter === tab ? Styles.activeFilter : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className={Styles.list}>
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((q, index) => {
            const plainTextContent = prepareForPreview(q.content);
            const isMulti = q.type.toLowerCase().includes("multi");
            const uiType = isMulti ? "Multiple Choice" : q.type === "Numerical" ? "Numerical" : "Single Choice";
            
            return (
              <div key={q.id} className={Styles.row}>
                
                <Link href={`/bookmarks/practice?q=${q.id}`} className={Styles.rowLeft}>
                  <span className={Styles.qNumber}>
                    {index + 1}.
                  </span>
                  <span className={Styles.qText}>
                    {plainTextContent.length === 0 ? (
                      <span style={{ fontStyle: 'italic', color: 'var(--dashboard-secondary-text-color)' }}>
                        Image Based Question
                      </span>
                    ) : (
                      <Latex>{plainTextContent}</Latex>
                    )}
                  </span>
                </Link>

                <div className={Styles.rowRight}>
                  <span className={`${Styles.tag} ${Styles.tagHiddenMobile}`}>
                    {uiType}
                  </span>
                  <span className={Styles.tag}>
                    {q.subject}
                  </span>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); 
                      removeBookmark(q.id);
                    }}
                    className={Styles.removeBtn}
                    title="Remove Bookmark"
                  >
                    <BookmarkMinus size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={Styles.emptyState}>
            <BookmarkMinus size={40} className={Styles.emptyIcon} />
            <p style={{ color: 'var(--dashboard-primary-text-color)', fontWeight: 600 }}>No bookmarks found</p>
            <p style={{ color: 'var(--dashboard-secondary-text-color)', fontSize: '13px', marginTop: '4px' }}>
              {searchQuery ? "Try adjusting your search criteria or filter choices." : "Questions you bookmark during chapterwise practice will appear here."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}