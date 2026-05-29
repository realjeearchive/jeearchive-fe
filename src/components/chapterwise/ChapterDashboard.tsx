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

// 🔥 FIX 1: Smarter Preview Parser that respects Latex.tsx heuristics
const prepareForPreview = (html: string) => {
  if (!html) return "";
  
  // Convert break/block tags to spaces so words don't merge (e.g. "Force<br>$$F$$" -> "Force $$F$$")
  let text = html.replace(/<br\s*\/?>/gi, " ");
  text = text.replace(/<\/p>|<\/div>|<\/li>/gi, " ");
  
  // Strip all remaining HTML tags
  text = text.replace(/<[^>]*>?/gm, " ");
  
  // Collapse multiple spaces into one
  text = text.replace(/\s+/g, " ").trim();
  
  // Convert Block Math to Inline Math so it doesn't break the single-line row layout
  text = text.replace(/\$\$/g, "$");
  text = text.replace(/\\\[/g, "\\(");
  text = text.replace(/\\\]/g, "\\)");
  
  return text;
};

// Helper for Session Dropdown formatting
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
    return Array.from(
      new Set(filtered.map((q) => q.papers?.session).filter(Boolean))
    ) as string[];
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

  // 🔥 FIX 2: Advanced Chronological Sorting
  const sortedBaseQuestions = [...baseQuestions].sort((a, b) => {
    // 1. Sort by Year (Descending: 2026 -> 2025)
    const yearA = a.papers?.year || 0;
    const yearB = b.papers?.year || 0;
    if (yearA !== yearB) return yearB - yearA;

    // 2. Sort by Session (Ascending: Session 1 -> Session 2)
    const sessionA = a.papers?.session || "";
    const sessionB = b.papers?.session || "";
    if (sessionA !== sessionB) return sessionA.localeCompare(sessionB);

    // 3. Sort by Month (Chronological)
    const months: Record<string, number> = {
      january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
      july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
    };
    const monthA = months[(a.papers?.month || "").toLowerCase()] || 99;
    const monthB = months[(b.papers?.month || "").toLowerCase()] || 99;
    if (monthA !== monthB) return monthA - monthB;

    // 4. Sort by Date (Numerical Ascending)
    const dateA = parseInt(a.papers?.date || "0");
    const dateB = parseInt(b.papers?.date || "0");
    if (dateA !== dateB) return dateA - dateB;

    // 5. Sort by Shift (Morning before Evening)
    const shiftA = a.papers?.shift?.toLowerCase() || "";
    const shiftB = b.papers?.shift?.toLowerCase() || "";
    if (shiftA !== shiftB) {
      const isMorningA = shiftA.includes("morning") || shiftA.includes("1");
      const isMorningB = shiftB.includes("morning") || shiftB.includes("1");
      if (isMorningA && !isMorningB) return -1;
      if (!isMorningA && isMorningB) return 1;
      return shiftA.localeCompare(shiftB);
    }

    // 6. Fallback to Question Number
    const numA = a.questionNumber || 0;
    const numB = b.questionNumber || 0;
    return numA - numB;
  });

  const activeQuestions = sortedBaseQuestions.filter((q, index) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const plainText = q.content
        ? q.content.replace(/<[^>]*>?/gm, "").trim().toLowerCase()
        : "";
      const qNum = (index + 1).toString();
      if (!plainText.includes(query) && !qNum.includes(query)) return false;
    }

    const p = q.papers;
    if (selectedYears.length > 0 && (!p?.year || !selectedYears.includes(p.year)))
      return false;
    if (
      selectedSessions.length > 0 &&
      (!p?.session || !selectedSessions.includes(p.session))
    )
      return false;

    const dateStr = p?.date && p?.month ? `${p.date} ${p.month}` : null;
    if (selectedDates.length > 0 && (!dateStr || !selectedDates.includes(dateStr)))
      return false;

    if (
      selectedShifts.length > 0 &&
      (!p?.shift || !selectedShifts.includes(p.shift))
    )
      return false;

    return true;
  });

  const clearFilters = () => {
    setSelectedYears([]);
    setSelectedSessions([]);
    setSelectedDates([]);
    setSelectedShifts([]);
    setIsFilterOpen(false);
    setOpenDropdown(null);
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage =
    stats.totalQuestions > 0
      ? (stats.totalUniqueSolved / stats.totalQuestions) * 100
      : 0;
  const offset = circumference - (progressPercentage / 100) * circumference;

  const subjectColor = subject.toLowerCase().includes("physic")
    ? "var(--dashboard-physics-color)"
    : subject.toLowerCase().includes("chemis")
    ? "var(--dashboard-chemistry-color)"
    : subject.toLowerCase().includes("math")
    ? "var(--dashboard-maths-color)"
    : "var(--dashboard-core-color)";

  const activeFilterCount =
    selectedYears.length +
    selectedSessions.length +
    selectedDates.length +
    selectedShifts.length;

  const practiceUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("type", activeFilter.toLowerCase());

    if (selectedYears.length > 0) params.set("years", selectedYears.join(","));
    if (selectedSessions.length > 0)
      params.set("sessions", selectedSessions.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedShifts.length > 0) params.set("shifts", selectedShifts.join(","));

    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  }, [
    activeFilter,
    selectedYears,
    selectedSessions,
    selectedDates,
    selectedShifts,
    subject,
    divisionSlug,
    chapterSlug,
  ]);

  const getQuestionUrl = (questionId: string) => {
    const params = new URLSearchParams();
    params.set("type", activeFilter.toLowerCase());
    params.set("q", questionId);

    if (selectedYears.length > 0) params.set("years", selectedYears.join(","));
    if (selectedSessions.length > 0)
      params.set("sessions", selectedSessions.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedShifts.length > 0) params.set("shifts", selectedShifts.join(","));

    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  };

  return (
    <div className={Styles.container}>
      <aside className={Styles.sidebar} aria-label="Chapter information and progress">
        <div className={Styles.card}>
          <div className={Styles.iconBox} aria-hidden="true">
            <span className={Styles.iconLetter} style={{ color: subjectColor }}>
              {subject.charAt(0).toUpperCase()}
            </span>
          </div>

          <h1 className={Styles.title}>{chapterName}</h1>
          <p className={Styles.subtitle}>
            JEE Archive • {stats.totalQuestions} Questions
          </p>

          {chapterData && (
            <div className={Styles.syllabusWrapper}>
              {!chapterData.isJeeMain && !chapterData.isJeeAdvanced ? (
                <span
                  className={Styles.badgeExcluded}
                  style={{ width: "fit-content" }}
                >
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

          <div className={Styles.progressContainer}>
            <div className={Styles.progressHeader}>
              <span>Progress</span>
            </div>
            <div className={Styles.progressContent}>
              <div className={Styles.chartWrapper} aria-label={`Progress: ${stats.totalUniqueSolved} of ${stats.totalQuestions} solved`}>
                <svg className={Styles.svgRing} viewBox="0 0 140 140" aria-hidden="true">
                  <circle className={Styles.ringBg} cx="70" cy="70" r={radius} />
                  <circle
                    className={Styles.ringFill}
                    cx="70"
                    cy="70"
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
                    <span className={Styles.solvedBig}>
                      {stats.totalUniqueSolved}
                    </span>
                    <span className={Styles.totalSmall}>
                      /{stats.totalQuestions}
                    </span>
                  </div>
                  <div className={Styles.solvedLabel}>
                    <Check size={12} strokeWidth={4} aria-hidden="true" /> Solved
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
                    {stats.uniqueSolvedAdvancedQuestions}/
                    {stats.totalAdvancedQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className={Styles.content} aria-label="Questions list">
        <div className={Styles.listHeader}>
          <div className={Styles.headerControls}>
            {/* FILTER BUTTON */}
            <div className={Styles.lcFilterContainer} ref={filterRef}>
              <button
                className={`${Styles.lcFilterToggle} ${activeFilterCount > 0 ? Styles.lcFilterActive : ""}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label={`Filter questions${activeFilterCount > 0 ? `, ${activeFilterCount} filters active` : ""}`}
                aria-expanded={isFilterOpen}
              >
                <Filter size={16} strokeWidth={2} aria-hidden="true" />
                {activeFilterCount > 0 && (
                  <span className={Styles.lcFilterDot} />
                )}
              </button>

              {isFilterOpen && (
                <div className={Styles.lcPopover} role="dialog" aria-label="Filter questions">
                  <div className={Styles.lcRowsContainer}>
                    {/* 1. YEAR ROW */}
                    {availableYears.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Calendar size={14} className={Styles.lcIcon} aria-hidden="true" /> Year
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() =>
                              setOpenDropdown(openDropdown === "year" ? null : "year")
                            }
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
                            <ChevronDown
                              size={14}
                              color="var(--dashboard-secondary-text-color)"
                              aria-hidden="true"
                            />
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
                                        prev.includes(yr)
                                          ? prev.filter((y) => y !== yr)
                                          : [...prev, yr]
                                      )
                                    }
                                  />
                                  <span>{yr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className={Styles.lcRemoveIcon}
                          onClick={() => setSelectedYears([])}
                          aria-label="Clear year filter"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* 2. SESSION ROW */}
                    {selectedYears.length > 0 && availableSessions.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Clock size={14} className={Styles.lcIcon} aria-hidden="true" /> Session
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === "session" ? null : "session"
                              )
                            }
                            role="button"
                            aria-expanded={openDropdown === "session"}
                          >
                            {/* 🔥 FIX 3: Proper Title Case format for Display */}
                            <span className={Styles.lcSelectedText}>
                              {selectedSessions.length === 0
                                ? "Select session..."
                                : selectedSessions.length === 1
                                ? formatSession(selectedSessions[0])
                                : `${selectedSessions.length} selected`}
                            </span>
                            <ChevronDown
                              size={14}
                              color="var(--dashboard-secondary-text-color)"
                              aria-hidden="true"
                            />
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
                                        prev.includes(sess)
                                          ? prev.filter((s) => s !== sess)
                                          : [...prev, sess]
                                      )
                                    }
                                  />
                                  <span>{formatSession(sess)}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className={Styles.lcRemoveIcon}
                          onClick={() => setSelectedSessions([])}
                          aria-label="Clear session filter"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* 3. DATE ROW */}
                    {selectedSessions.length > 0 && availableDates.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Tag size={14} className={Styles.lcIcon} aria-hidden="true" /> Date
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() =>
                              setOpenDropdown(openDropdown === "date" ? null : "date")
                            }
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
                            <ChevronDown
                              size={14}
                              color="var(--dashboard-secondary-text-color)"
                              aria-hidden="true"
                            />
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
                                        prev.includes(dateStr)
                                          ? prev.filter((d) => d !== dateStr)
                                          : [...prev, dateStr]
                                      )
                                    }
                                  />
                                  <span>{dateStr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className={Styles.lcRemoveIcon}
                          onClick={() => setSelectedDates([])}
                          aria-label="Clear date filter"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* 4. SHIFT ROW */}
                    {selectedDates.length > 0 && availableShifts.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}>
                          <Sun size={14} className={Styles.lcIcon} aria-hidden="true" /> Shift
                        </div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div
                            className={Styles.lcValueBox}
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === "shift" ? null : "shift"
                              )
                            }
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
                            <ChevronDown
                              size={14}
                              color="var(--dashboard-secondary-text-color)"
                              aria-hidden="true"
                            />
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
                                        prev.includes(shift)
                                          ? prev.filter((s) => s !== shift)
                                          : [...prev, shift]
                                      )
                                    }
                                  />
                                  <span>{shift}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className={Styles.lcRemoveIcon}
                          onClick={() => setSelectedShifts([])}
                          aria-label="Clear shift filter"
                        >
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

            {/* TABS */}
            <nav className={Styles.filterTabs} aria-label="Exam type filter">
              <button
                className={`${Styles.filterBtn} ${activeFilter === "Main" ? Styles.activeFilter : ""}`}
                onClick={() => {
                  setActiveFilter("Main");
                  clearFilters();
                  setSearchQuery("");
                }}
                aria-pressed={activeFilter === "Main"}
              >
                JEE Main
              </button>
              <button
                className={`${Styles.filterBtn} ${activeFilter === "Advanced" ? Styles.activeFilter : ""}`}
                onClick={() => {
                  setActiveFilter("Advanced");
                  clearFilters();
                  setSearchQuery("");
                }}
                aria-pressed={activeFilter === "Advanced"}
              >
                JEE Advanced
              </button>
            </nav>
          </div>
        </div>

        <div className={Styles.list} role="list" aria-label="Questions">
          {activeQuestions && activeQuestions.length > 0 ? (
            activeQuestions.map((q, index) => {
              const isSuccess = q.attemptStatus === "Successfully attempted";
              const plainTextContent = prepareForPreview(q.content);
              return (
                <Link
                  key={q.id}
                  href={getQuestionUrl(q.id)}
                  className={Styles.row}
                  role="listitem"
                  aria-label={`Question ${index + 1}: ${plainTextContent.substring(0, 80)}`}
                >
                  <div className={Styles.rowLeft}>
                    <div className={Styles.statusIcon} aria-hidden="true">
                      {isSuccess ? (
                        <Check
                          size={16}
                          strokeWidth={3}
                          className={Styles.iconSuccess}
                        />
                      ) : (
                        <span className={Styles.iconEmpty}></span>
                      )}
                    </div>
                    <span className={Styles.qText}>
                      {index + 1}.{" "}
                      {plainTextContent.length === 0 ? (
                        <span className="italic text-gray-500">
                          Image Based Question
                        </span>
                      ) : (
                        <Latex>{plainTextContent}</Latex>
                      )}
                    </span>
                  </div>
                  <div className={Styles.rowRight}>
                    {q.papers && (
                      <span className={Styles.yearTag}>{q.papers.year}</span>
                    )}
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
      </main>
    </div>
  );
};