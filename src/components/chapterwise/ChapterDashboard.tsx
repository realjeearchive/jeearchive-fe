"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ChapterInfoResponse } from "@/features/chapterWise/api";
import Styles from "./ChapterDashboard.module.css";

import Latex from "@/components/testPlayer/Latex/Latex";
import {
  Play,
  Check,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  Clock,
  Tag,
  Sun,
  Minus,
} from "lucide-react";

interface ChapterDashboardProps {
  data: ChapterInfoResponse;
  subject: string;
  chapterSlug: string;
  divisionSlug: string;
  chapterName: string;
}

// ─── Subject Icons ────────────────────────────────────────────────────────
function PhysicsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <circle cx="16" cy="16" r="2.5" fill="var(--subject-physics)" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="var(--subject-physics)" strokeWidth="1.6" fill="none" opacity="0.9" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="var(--subject-physics)" strokeWidth="1.6" fill="none" opacity="0.6"
        transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="11" ry="4.5" stroke="var(--subject-physics)" strokeWidth="1.6" fill="none" opacity="0.35"
        transform="rotate(-60 16 16)" />
    </svg>
  );
}

function ChemistryIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <path
        d="M12 4 L12 14 L6.5 24 Q5.5 26 7 27.5 Q8 28.5 10 28.5 L22 28.5 Q24 28.5 25 27.5 Q26.5 26 25.5 24 L20 14 L20 4 Z"
        stroke="var(--subject-chemistry)" strokeWidth="1.7" fill="none" strokeLinejoin="round"
      />
      <path
        d="M9 22 Q10 20.5 16 21 Q22 21.5 23 22 L25.2 26 Q24.5 27.5 22 27.5 L10 27.5 Q7.5 27.5 6.8 26 Z"
        fill="var(--subject-chemistry)" opacity="0.3"
      />
      <circle cx="14" cy="24.5" r="1" fill="var(--subject-chemistry)" opacity="0.7" />
      <circle cx="18" cy="23" r="0.7" fill="var(--subject-chemistry)" opacity="0.5" />
      <line x1="12" y1="8" x2="20" y2="8" stroke="var(--subject-chemistry)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MathsIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={Styles.subjectIconSvg}>
      <path
        d="M22 6 L10 6 L17.5 15.5 L10 25 L22 25"
        stroke="var(--subject-maths)" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="10" y1="6" x2="22" y2="6" stroke="var(--subject-maths)" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="25" x2="22" y2="25" stroke="var(--subject-maths)" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="10" x2="25" y2="14" stroke="var(--subject-maths)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
      <line x1="23" y1="12" x2="27" y2="12" stroke="var(--subject-maths)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function getSubjectIcon(subject: string) {
  if (subject.toLowerCase().includes("physic")) return <PhysicsIcon />;
  if (subject.toLowerCase().includes("chemis")) return <ChemistryIcon />;
  return <MathsIcon />;
}

function getSubjectIconClass(subject: string) {
  if (subject.toLowerCase().includes("physic")) return Styles.iconContainerPhysics;
  if (subject.toLowerCase().includes("chemis")) return Styles.iconContainerChemistry;
  return Styles.iconContainerMaths;
}

// ─── THE FIX: Safely parse HTML without destroying LaTeX ────────────────────
const prepareForPreview = (html: string) => {
  if (!html) return "";
  
  let text = html;

  if (typeof window !== "undefined") {
    // We add spaces around block elements so words don't get squished together
    const preProcessed = html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>|<\/div>|<\/li>/gi, " ");
      
    // Safely parse the HTML to strip tags and decode entities (e.g. &gt; becomes >)
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = preProcessed;
    text = tempDiv.textContent || tempDiv.innerText || "";
  } else {
    // SSR Fallback (Basic regex replacing)
    text = text
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>|<\/div>|<\/li>/gi, " ")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  }

  // Clean up extra spaces
  text = text.replace(/\s+/g, " ").trim();
  
  // Convert block math to inline math so it flows beautifully in a single line
  text = text.replace(/\$\$/g, "$");
  text = text.replace(/\\\[/g, "\\(");
  text = text.replace(/\\\]/g, "\\)");
  
  return text;
};

// ─── Component ─────────────────────────────────────────────────────────────
const formatSession = (sess: string) => {
  if (!sess) return "";
  const parts = sess.replace(/_/g, " ").split(" ");
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
};

export const ChapterDashboard: React.FC<ChapterDashboardProps> = ({
  data,
  subject,
  chapterSlug,
  divisionSlug,
  chapterName,
}) => {
  const [activeFilter, setActiveFilter] = useState<"Main" | "Advanced">("Main");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "year" | "session" | "date" | "shift" | null
  >(null);

  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  // Pagination State & Refs
  const [currentPage, setCurrentPage] = useState(1);
  const contentRef = useRef<HTMLElement>(null);

  // Persistence State & Effects
  const [isReady, setIsReady] = useState(false);
  const [lastChapterSlug, setLastChapterSlug] = useState(chapterSlug);

  if (chapterSlug !== lastChapterSlug) {
    setLastChapterSlug(chapterSlug);
    setIsReady(false);
  }

  // Load filters from sessionStorage on mount / chapter change
  useEffect(() => {
    const saved = sessionStorage.getItem(`cw-filters-${chapterSlug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Defer updating to next tick to avoid synchronous cascading renders error
        setTimeout(() => {
          if (parsed.activeFilter) setActiveFilter(parsed.activeFilter);
          if (parsed.searchQuery) setSearchQuery(parsed.searchQuery);
          if (parsed.selectedYears) setSelectedYears(parsed.selectedYears);
          if (parsed.selectedSessions) setSelectedSessions(parsed.selectedSessions);
          if (parsed.selectedDates) setSelectedDates(parsed.selectedDates);
          if (parsed.selectedShifts) setSelectedShifts(parsed.selectedShifts);
          if (parsed.currentPage) setCurrentPage(parsed.currentPage);
          setIsReady(true);
        }, 0);
      } catch (e) {
        console.error("Error parsing saved filters", e);
        setTimeout(() => {
          setIsReady(true);
        }, 0);
      }
    } else {
      // Clear filters if no saved filters exist (deferred to avoid synchronous state updates)
      setTimeout(() => {
        setActiveFilter("Main");
        setSearchQuery("");
        setSelectedYears([]);
        setSelectedSessions([]);
        setSelectedDates([]);
        setSelectedShifts([]);
        setCurrentPage(1);
        setIsReady(true);
      }, 0);
    }
  }, [chapterSlug]);

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    if (!isReady) return;
    
    const stateToSave = {
      activeFilter,
      searchQuery,
      selectedYears,
      selectedSessions,
      selectedDates,
      selectedShifts,
      currentPage
    };
    sessionStorage.setItem(`cw-filters-${chapterSlug}`, JSON.stringify(stateToSave));
  }, [chapterSlug, activeFilter, searchQuery, selectedYears, selectedSessions, selectedDates, selectedShifts, currentPage, isReady]);

  const { stats, jeeMain, jeeAdvanced, chapterData } = data;
  const baseQuestions = activeFilter === "Main" ? jeeMain : jeeAdvanced;

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(baseQuestions.map((q) => q.papers?.year).filter(Boolean))
    ) as number[];
    return years.sort((a, b) => b - a);
  }, [baseQuestions]);

  const availableSessions = useMemo(() => {
    const filtered = baseQuestions.filter((q) => {
      return (
        selectedYears.length === 0 ||
        (q.papers?.year !== undefined && selectedYears.includes(q.papers.year))
      );
    });
    const sessions = Array.from(
      new Set(filtered.map((q) => q.papers?.session).filter(Boolean))
    ) as string[];
    return sessions.filter((sess) => {
      const lower = sess.toLowerCase();
      return lower.includes("1") || lower.includes("2") || lower.includes("one") || lower.includes("two");
    });
  }, [baseQuestions, selectedYears]);

  const availableDates = useMemo(() => {
    const filtered = baseQuestions.filter((q) => {
      const yMatch =
        selectedYears.length === 0 ||
        (q.papers?.year !== undefined && selectedYears.includes(q.papers.year));
      const sMatch =
        selectedSessions.length === 0 ||
        (q.papers?.session !== undefined && selectedSessions.includes(q.papers.session));
      return yMatch && sMatch;
    });
    const dates = filtered
      .map((q) =>
        q.papers?.date && q.papers?.month
          ? `${q.papers.date} ${q.papers.month}`
          : null
      )
      .filter(Boolean) as string[];
    return Array.from(new Set(dates));
  }, [baseQuestions, selectedYears, selectedSessions]);

  const availableShifts = useMemo(() => {
    const filtered = baseQuestions.filter((q) => {
      const yMatch =
        selectedYears.length === 0 ||
        (q.papers?.year !== undefined && selectedYears.includes(q.papers.year));
      const sMatch =
        selectedSessions.length === 0 ||
        (q.papers?.session !== undefined && selectedSessions.includes(q.papers.session));
      const dateStr =
        q.papers?.date && q.papers?.month
          ? `${q.papers.date} ${q.papers.month}`
          : null;
      const dMatch =
        selectedDates.length === 0 ||
        (dateStr !== null && selectedDates.includes(dateStr));
      return yMatch && sMatch && dMatch;
    });
    return Array.from(
      new Set(filtered.map((q) => q.papers?.shift).filter(Boolean))
    ) as string[];
  }, [baseQuestions, selectedYears, selectedSessions, selectedDates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
        setOpenDropdown(null);
      } else if (!target.closest("[data-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedBaseQuestions = [...baseQuestions].sort((a, b) => {
    const yearA = a.papers?.year || 0;
    const yearB = b.papers?.year || 0;
    if (yearA !== yearB) return yearB - yearA;

    const sessionA = a.papers?.session || "";
    const sessionB = b.papers?.session || "";
    if (sessionA !== sessionB) return sessionA.localeCompare(sessionB);

    const months: Record<string, number> = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    };
    const monthA = months[(a.papers?.month || "").toLowerCase()] || 99;
    const monthB = months[(b.papers?.month || "").toLowerCase()] || 99;
    if (monthA !== monthB) return monthA - monthB;

    const dateA = parseInt(a.papers?.date || "0");
    const dateB = parseInt(b.papers?.date || "0");
    if (dateA !== dateB) return dateA - dateB;

    const shiftA = a.papers?.shift?.toLowerCase() || "";
    const shiftB = b.papers?.shift?.toLowerCase() || "";
    if (shiftA !== shiftB) {
      const isMorningA = shiftA.includes("morning") || shiftA.includes("1");
      const isMorningB = shiftB.includes("morning") || shiftB.includes("1");
      if (isMorningA && !isMorningB) return -1;
      if (!isMorningA && isMorningB) return 1;
      return shiftA.localeCompare(shiftB);
    }

    return (a.questionNumber || 0) - (b.questionNumber || 0);
  });

  const activeQuestions = sortedBaseQuestions.filter((q, index) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      // We use the same safe text extractor for accurate search
      const plainText = prepareForPreview(q.content).toLowerCase();
      const qNum = (index + 1).toString();
      if (!plainText.includes(query) && !qNum.includes(query)) return false;
    }

    const p = q.papers;
    if (selectedYears.length > 0 && (!p?.year || !selectedYears.includes(p.year)))
      return false;
    if (selectedSessions.length > 0 && (!p?.session || !selectedSessions.includes(p.session)))
      return false;

    const dateStr = p?.date && p?.month ? `${p.date} ${p.month}` : null;
    if (selectedDates.length > 0 && (!dateStr || !selectedDates.includes(dateStr)))
      return false;

    if (selectedShifts.length > 0 && (!p?.shift || !selectedShifts.includes(p.shift)))
      return false;

    return true;
  });

  // Reset page when filters change (React-recommended render-phase adjustment)
  const [lastFilterKey, setLastFilterKey] = useState("");
  const currentFilterKey = `${activeFilter}-${searchQuery}-${selectedYears.join(",")}-${selectedSessions.join(",")}-${selectedDates.join(",")}-${selectedShifts.join(",")}`;

  if (currentFilterKey !== lastFilterKey) {
    setLastFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  const questionsPerPage = 30;
  const totalPages = Math.ceil(activeQuestions.length / questionsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedQuestions = useMemo(() => {
    return activeQuestions.slice((safeCurrentPage - 1) * questionsPerPage, safeCurrentPage * questionsPerPage);
  }, [activeQuestions, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safeCurrentPage <= 4) {
        pages.push(2, 3, 4, 5);
        pages.push("...");
        pages.push(totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        pages.push("...");
        pages.push(safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const clearFilters = () => {
    setSelectedYears([]);
    setSelectedSessions([]);
    setSelectedDates([]);
    setSelectedShifts([]);
    setIsFilterOpen(false);
    setOpenDropdown(null);
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage =
    stats.totalQuestions > 0
      ? (stats.totalUniqueSolved / stats.totalQuestions) * 100
      : 0;
  const offset = circumference - (progressPercentage / 100) * circumference;

  const subjectColor = subject.toLowerCase().includes("physic")
    ? "var(--subject-physics)"
    : subject.toLowerCase().includes("chemis")
    ? "var(--subject-chemistry)"
    : subject.toLowerCase().includes("math")
    ? "var(--subject-maths)"
    : "var(--color-brand-primary)";

  const activeFilterCount =
    selectedYears.length +
    selectedSessions.length +
    selectedDates.length +
    selectedShifts.length;

  const practiceUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("type", activeFilter.toLowerCase());
    if (selectedYears.length > 0) params.set("years", selectedYears.join(","));
    if (selectedSessions.length > 0) params.set("sessions", selectedSessions.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedShifts.length > 0) params.set("shifts", selectedShifts.join(","));
    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  }, [activeFilter, selectedYears, selectedSessions, selectedDates, selectedShifts, subject, divisionSlug, chapterSlug]);

  const getQuestionUrl = (questionId: string) => {
    const params = new URLSearchParams();
    params.set("type", activeFilter.toLowerCase());
    params.set("q", questionId);
    if (selectedYears.length > 0) params.set("years", selectedYears.join(","));
    if (selectedSessions.length > 0) params.set("sessions", selectedSessions.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedShifts.length > 0) params.set("shifts", selectedShifts.join(","));
    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  };

  return (
    <div className={Styles.container}>
      {/* ─── SIDEBAR ───────────────────────────────────────────────────── */}
      <aside className={Styles.sidebar} aria-label="Chapter information and progress">
        <div className={Styles.card}>

          {/* Subject Icon */}
          <div className={`${Styles.graphicIconContainer} ${getSubjectIconClass(subject)}`} aria-hidden="true">
            {getSubjectIcon(subject)}
          </div>

          <h1 className={Styles.title}>{chapterName}</h1>
          <p className={Styles.subtitle}>
            JEE Archive • {stats.totalQuestions} Questions
          </p>

          {chapterData && (
            <div className={Styles.syllabusWrapper}>
              {!chapterData.isJeeMain && !chapterData.isJeeAdvanced ? (
                <span className={Styles.badgeExcluded} style={{ width: "fit-content" }}>
                  <Minus size={12} strokeWidth={3} aria-hidden="true" /> Excluded Chapter
                </span>
              ) : (
                <>
                  <span className={Styles.syllabusLabel}>Included in:</span>
                  <div className={Styles.syllabusBadges}>
                    {chapterData.isJeeMain && (
                      <span className={Styles.badgeMain}>
                        <Check size={12} strokeWidth={3} aria-hidden="true" /> JEE Main
                      </span>
                    )}
                    {chapterData.isJeeAdvanced && (
                      <span className={Styles.badgeAdv}>
                        <Check size={12} strokeWidth={3} aria-hidden="true" /> JEE Advanced
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <Link
            href={practiceUrl}
            className={Styles.practiceBtn}
            aria-label={`Practice ${chapterName} ${activeFilter}`}
          >
            <Play size={16} fill="currentColor" strokeWidth={1} aria-hidden="true" />
            Practice {activeFilter}
          </Link>

          {/* Search */}
          <div className={Styles.sidebarSearchWrapper}>
            <span className={Styles.sectionLabel}>SEARCH</span>
            <div className={Styles.searchContainer}>
              <Search size={16} className={Styles.searchIcon} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search questions..."
                className={Styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search questions by text or number"
              />
            </div>
          </div>

          {/* Progress */}
          <div className={Styles.progressContainer}>
            <div className={Styles.progressHeader}>
              <span>Progress</span>
            </div>
            <div className={Styles.progressContent}>
              <div
                className={Styles.chartWrapper}
                aria-label={`Progress: ${stats.totalUniqueSolved} of ${stats.totalQuestions} solved`}
              >
                <svg className={Styles.svgRing} viewBox="0 0 120 120" aria-hidden="true">
                  <circle className={Styles.ringBg} cx="60" cy="60" r={radius} />
                  <circle
                    className={Styles.ringFill}
                    cx="60"
                    cy="60"
                    r={radius}
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: offset,
                      stroke: subjectColor,
                    }}
                  />
                </svg>
                <div className={Styles.chartText}>
                  <div className={Styles.scoreLine}>
                    <span className={Styles.solvedBig}>{stats.totalUniqueSolved}</span>
                    <span className={Styles.totalSmall}>/{stats.totalQuestions}</span>
                  </div>
                  <div className={Styles.solvedLabel}>
                    <Check size={11} strokeWidth={4} aria-hidden="true" /> Solved
                  </div>
                </div>
              </div>

              <div className={Styles.statColumn}>
                <div className={Styles.statBox}>
                  <span className={Styles.mainsLabel}>Mains</span>
                  <span className={Styles.statValue}>
                    {stats.uniqueSolvedMainQuestions}/{stats.totalMainQuestions}
                  </span>
                </div>
                <div className={Styles.statBox}>
                  <span className={Styles.advancedLabel}>Advanced</span>
                  <span className={Styles.statValue}>
                    {stats.uniqueSolvedAdvancedQuestions}/{stats.totalAdvancedQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────── */}
      <main ref={contentRef} className={Styles.content} aria-label="Questions list">
        <div className={Styles.listHeader}>
          <div className={Styles.headerControls}>

            {/* Filter button */}
            <div className={Styles.lcFilterContainer} ref={filterRef}>
              <button
                className={`${Styles.lcFilterToggle} ${activeFilterCount > 0 ? Styles.lcFilterActive : ""}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label={`Filter questions${activeFilterCount > 0 ? `, ${activeFilterCount} filters active` : ""}`}
                aria-expanded={isFilterOpen}
              >
                <Filter size={16} strokeWidth={2} aria-hidden="true" />
                {activeFilterCount > 0 && <span className={Styles.lcFilterDot} />}
              </button>

              {isFilterOpen && (
                <div className={Styles.lcPopover} role="dialog" aria-label="Filter questions">
                  <div className={Styles.lcRowsContainer}>

                    {/* Year */}
                    {availableYears.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Calendar size={14} className={Styles.lcIcon} aria-hidden="true" /> Year
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() => setOpenDropdown(openDropdown === "year" ? null : "year")}
                            role="button"
                            aria-expanded={openDropdown === "year"}
                          >
                            <span className={Styles.lcSelectedText}>
                              {selectedYears.length === 0
                                ? "Select year..."
                                : selectedYears.length === 1
                                ? selectedYears[0]
                                : `${selectedYears.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--text-secondary)" aria-hidden="true" />
                          </div>
                          {openDropdown === "year" && (
                            <div className={Styles.lcDropdownMenu} role="listbox" aria-label="Select years">
                              {availableYears.map((yr) => (
                                <label key={yr} className={Styles.lcDropdownItem}>
                                  <input
                                    type="checkbox"
                                    className={Styles.lcCheckbox}
                                    checked={selectedYears.includes(yr)}
                                    onChange={() =>
                                      setSelectedYears((prev) =>
                                        prev.includes(yr) ? prev.filter((y) => y !== yr) : [...prev, yr]
                                      )
                                    }
                                  />
                                  <span>{yr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className={Styles.lcRemoveIcon} onClick={() => setSelectedYears([])} aria-label="Clear year filter">
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* Session */}
                    {selectedYears.length > 0 && availableSessions.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Clock size={14} className={Styles.lcIcon} aria-hidden="true" /> Session
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() => setOpenDropdown(openDropdown === "session" ? null : "session")}
                            role="button"
                            aria-expanded={openDropdown === "session"}
                          >
                            <span className={Styles.lcSelectedText}>
                              {selectedSessions.length === 0
                                ? "Select session..."
                                : selectedSessions.length === 1
                                ? formatSession(selectedSessions[0])
                                : `${selectedSessions.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--text-secondary)" aria-hidden="true" />
                          </div>
                          {openDropdown === "session" && (
                            <div className={Styles.lcDropdownMenu} role="listbox" aria-label="Select sessions">
                              {availableSessions.map((sess) => (
                                <label key={sess} className={Styles.lcDropdownItem}>
                                  <input
                                    type="checkbox"
                                    className={Styles.lcCheckbox}
                                    checked={selectedSessions.includes(sess)}
                                    onChange={() =>
                                      setSelectedSessions((prev) =>
                                        prev.includes(sess) ? prev.filter((s) => s !== sess) : [...prev, sess]
                                      )
                                    }
                                  />
                                  <span>{formatSession(sess)}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className={Styles.lcRemoveIcon} onClick={() => setSelectedSessions([])} aria-label="Clear session filter">
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* Date */}
                    {selectedSessions.length > 0 && availableDates.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Tag size={14} className={Styles.lcIcon} aria-hidden="true" /> Date
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
                            role="button"
                            aria-expanded={openDropdown === "date"}
                          >
                            <span className={Styles.lcSelectedText}>
                              {selectedDates.length === 0
                                ? "Select date..."
                                : selectedDates.length === 1
                                ? selectedDates[0]
                                : `${selectedDates.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--text-secondary)" aria-hidden="true" />
                          </div>
                          {openDropdown === "date" && (
                            <div className={Styles.lcDropdownMenu} role="listbox" aria-label="Select dates">
                              {availableDates.map((dateStr) => (
                                <label key={dateStr} className={Styles.lcDropdownItem}>
                                  <input
                                    type="checkbox"
                                    className={Styles.lcCheckbox}
                                    checked={selectedDates.includes(dateStr)}
                                    onChange={() =>
                                      setSelectedDates((prev) =>
                                        prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
                                      )
                                    }
                                  />
                                  <span>{dateStr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className={Styles.lcRemoveIcon} onClick={() => setSelectedDates([])} aria-label="Clear date filter">
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* Shift */}
                    {selectedDates.length > 0 && availableShifts.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Sun size={14} className={Styles.lcIcon} aria-hidden="true" /> Shift
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() => setOpenDropdown(openDropdown === "shift" ? null : "shift")}
                            role="button"
                            aria-expanded={openDropdown === "shift"}
                          >
                            <span className={Styles.lcSelectedText}>
                              {selectedShifts.length === 0
                                ? "Select shift..."
                                : selectedShifts.length === 1
                                ? selectedShifts[0]
                                : `${selectedShifts.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--text-secondary)" aria-hidden="true" />
                          </div>
                          {openDropdown === "shift" && (
                            <div className={Styles.lcDropdownMenu} role="listbox" aria-label="Select shifts">
                              {availableShifts.map((shift) => (
                                <label key={shift} className={Styles.lcDropdownItem}>
                                  <input
                                    type="checkbox"
                                    className={Styles.lcCheckbox}
                                    checked={selectedShifts.includes(shift)}
                                    onChange={() =>
                                      setSelectedShifts((prev) =>
                                        prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
                                      )
                                    }
                                  />
                                  <span>{shift}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className={Styles.lcRemoveIcon} onClick={() => setSelectedShifts([])} aria-label="Clear shift filter">
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={Styles.lcFooter}>
                    <button onClick={clearFilters} className={Styles.lcResetBtn}>
                      <RotateCcw size={14} aria-hidden="true" /> Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <nav className={Styles.filterTabs} aria-label="Exam type filter">
              <button
                className={`${Styles.filterBtn} ${activeFilter === "Main" ? Styles.activeFilter : ""}`}
                onClick={() => { setActiveFilter("Main"); clearFilters(); setSearchQuery(""); }}
                aria-pressed={activeFilter === "Main"}
              >
                JEE Main
              </button>
              <button
                className={`${Styles.filterBtn} ${activeFilter === "Advanced" ? Styles.activeFilter : ""}`}
                onClick={() => { setActiveFilter("Advanced"); clearFilters(); setSearchQuery(""); }}
                aria-pressed={activeFilter === "Advanced"}
              >
                JEE Advanced
              </button>
            </nav>
          </div>
        </div>

        <div className={Styles.list} role="list" aria-label="Questions">
          {paginatedQuestions && paginatedQuestions.length > 0 ? (
            paginatedQuestions.map((q, index) => {
              const isSuccess = q.attemptStatus === "Successfully attempted";
              // Cleanly extract text + math without breaking HTML entities
              const plainTextContent = prepareForPreview(q.content);
              const questionIndex = (safeCurrentPage - 1) * questionsPerPage + index;
              return (
                <Link
                  key={q.id}
                  href={getQuestionUrl(q.id)}
                  className={Styles.row}
                  role="listitem"
                  aria-label={`Question ${questionIndex + 1}: ${plainTextContent.substring(0, 80)}`}
                >
                  <div className={Styles.rowLeft}>
                    <div className={Styles.statusIcon} aria-hidden="true">
                      {isSuccess ? (
                        <Check size={16} strokeWidth={3} className={Styles.iconSuccess} />
                      ) : (
                        <span className={Styles.iconEmpty}></span>
                      )}
                    </div>
                    <span className={Styles.qText}>
                      {questionIndex + 1}.{" "}
                      {plainTextContent.length === 0 ? (
                        <span className="italic text-gray-500">Image Based Question</span>
                      ) : (
                        // Render safely through Latex
                        <Latex>{plainTextContent}</Latex>
                      )}
                    </span>
                  </div>
                  <div className={Styles.rowRight}>
                    {q.papers && <span className={Styles.yearTag}>{q.papers.year}</span>}
                    <span className={Styles.tag}>
                      {q.type === "SingleCorrect" ? "Single Choice" : "Numerical"}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className={Styles.emptyState}>
              <p>No matching questions found.</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className={Styles.clearStateBtn}>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <nav className={Styles.pagination} aria-label="Pagination Navigation">
            <button
              className={Styles.pageBtn}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft size={16} />
            </button>
            
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className={Styles.pageEllipsis}>
                    &hellip;
                  </span>
                );
              }
              
              return (
                <button
                  key={`page-${page}`}
                  className={`${Styles.pageBtn} ${
                    safeCurrentPage === page ? Styles.pageBtnActive : ""
                  }`}
                  onClick={() => handlePageChange(page as number)}
                  aria-label={`Go to page ${page}`}
                  aria-current={safeCurrentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              className={Styles.pageBtn}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Go to next page"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </main>
    </div>
  );
};