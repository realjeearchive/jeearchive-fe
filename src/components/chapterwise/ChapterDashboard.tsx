'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChapterInfoResponse } from "@/features/chapterWise/api";
import Styles from './ChapterDashboard.module.css';
import { Play, Check, Search, Filter, ChevronDown, RotateCcw } from 'lucide-react';
import Latex from "@/components/testPlayer/Latex/Latex";

interface ChapterDashboardProps {
  data: ChapterInfoResponse;
  subject: string;
  chapterSlug: string;
  divisionSlug: string;
  chapterName: string;
}

const prepareForPreview = (html: string) => {
  if (!html) return "";
  let text = html.replace(/<[^>]*>?/gm, '').trim();
  text = text.replace(/\$\$/g, '$').replace(/\\\[/g, '$').replace(/\\\]/g, '$');
  return text;
};

export const ChapterDashboard: React.FC<ChapterDashboardProps> = ({
  data,
  subject,
  chapterSlug,
  divisionSlug,
  chapterName
}) => {
  const [activeFilter, setActiveFilter] = useState<'Main' | 'Advanced'>('Main');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Filter Popover State ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'year' | 'date' | null>(null);
  
  // Selected filter arrays
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const { stats, jeeMain, jeeAdvanced, chapterData } = data;
  const baseQuestions = activeFilter === 'Main' ? jeeMain : jeeAdvanced;

  // --- CASCADING DYNAMIC FILTERS ---
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(baseQuestions.map(q => q.papers?.year).filter(Boolean))) as number[];
    return years.sort((a, b) => b - a);
  }, [baseQuestions]);

  const availableSessions = useMemo(() => {
    const filtered = baseQuestions.filter(q => selectedYears.length === 0 || selectedYears.includes(q.papers?.year!));
    return Array.from(new Set(filtered.map(q => q.papers?.session).filter(Boolean))) as string[];
  }, [baseQuestions, selectedYears]);

  const availableDates = useMemo(() => {
    const filtered = baseQuestions.filter(q => {
      const yMatch = selectedYears.length === 0 || selectedYears.includes(q.papers?.year!);
      const sMatch = selectedSessions.length === 0 || selectedSessions.includes(q.papers?.session!);
      return yMatch && sMatch;
    });
    const dates = filtered.map(q => q.papers?.date && q.papers?.month ? `${q.papers.date} ${q.papers.month}` : null).filter(Boolean) as string[];
    return Array.from(new Set(dates));
  }, [baseQuestions, selectedYears, selectedSessions]);

  const availableShifts = useMemo(() => {
    const filtered = baseQuestions.filter(q => {
      const yMatch = selectedYears.length === 0 || selectedYears.includes(q.papers?.year!);
      const sMatch = selectedSessions.length === 0 || selectedSessions.includes(q.papers?.session!);
      const dateStr = q.papers?.date && q.papers?.month ? `${q.papers.date} ${q.papers.month}` : null;
      const dMatch = selectedDates.length === 0 || (dateStr && selectedDates.includes(dateStr));
      return yMatch && sMatch && dMatch;
    });
    return Array.from(new Set(filtered.map(q => q.papers?.shift).filter(Boolean))) as string[];
  }, [baseQuestions, selectedYears, selectedSessions, selectedDates]);

  // 🔥 THE FIX: Enhanced outside click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 1. If clicking completely outside the filter button & popover
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
        setOpenDropdown(null); 
      } 
      // 2. If clicking inside the popover, but outside a dropdown container
      else if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const sortedBaseQuestions = [...baseQuestions].sort((a, b) => {
    const numA = a.questionNumber || 0;
    const numB = b.questionNumber || 0;
    return numA - numB;
  });

  // --- FILTER ENGINE ---
  const activeQuestions = sortedBaseQuestions.filter((q, index) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const plainText = q.content ? q.content.replace(/<[^>]*>?/gm, '').trim().toLowerCase() : '';
      const qNum = (index + 1).toString(); 
      if (!plainText.includes(query) && !qNum.includes(query)) return false;
    }

    const p = q.papers;
    if (selectedYears.length > 0 && (!p?.year || !selectedYears.includes(p.year))) return false;
    if (selectedSessions.length > 0 && (!p?.session || !selectedSessions.includes(p.session))) return false;
    
    const dateStr = p?.date && p?.month ? `${p.date} ${p.month}` : null;
    if (selectedDates.length > 0 && (!dateStr || !selectedDates.includes(dateStr))) return false;
    
    if (selectedShifts.length > 0 && (!p?.shift || !selectedShifts.includes(p.shift))) return false;
    
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
  const progressPercentage = stats.totalQuestions > 0 
    ? (stats.totalUniqueSolved / stats.totalQuestions) * 100 : 0;
  const offset = circumference - (progressPercentage / 100) * circumference;

  const subjectColor = subject.toLowerCase().includes('physic') ? 'var(--dashboard-physics-color)' : 
                       subject.toLowerCase().includes('chemis') ? 'var(--dashboard-chemistry-color)' : 
                       subject.toLowerCase().includes('math') ? 'var(--dashboard-maths-color)' : 'var(--dashboard-core-color)';

  const activeFilterCount = selectedYears.length + selectedSessions.length + selectedDates.length + selectedShifts.length;

  return (
    <div className={Styles.container}>
      <aside className={Styles.sidebar}>
        <div className={Styles.card}>
          <div className={Styles.iconBox}>
            <span className={Styles.iconLetter} style={{ color: subjectColor }}>
              {subject.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h1 className={Styles.title}>{chapterName}</h1>
          <p className={Styles.subtitle}>JEE Archive • {stats.totalQuestions} Questions</p>

          {chapterData && (
            <div className={Styles.syllabusWrapper}>
              <span className={Styles.syllabusLabel}>Included in:</span>
              <div className={Styles.syllabusBadges}>
                 {chapterData.isJeeMain && (
                   <span className={Styles.badgeMain}>
                     <Check size={12} strokeWidth={3} /> JEE Main
                   </span>
                 )}
                 {chapterData.isJeeAdvanced && (
                   <span className={Styles.badgeAdv}>
                     <Check size={12} strokeWidth={3} /> JEE Advanced
                   </span>
                 )}
              </div>
            </div>
          )}

          <Link 
            href={`/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?type=${activeFilter.toLowerCase()}`} 
            className={Styles.practiceBtn}
          >
            <Play size={16} fill="currentColor" strokeWidth={1} />
            Practice {activeFilter}
          </Link>

          <div className={Styles.progressContainer}>
             <div className={Styles.progressHeader}><span>Progress</span></div>
             <div className={Styles.progressContent}>
                <div className={Styles.chartWrapper}>
                   <svg className={Styles.svgRing} viewBox="0 0 140 140">
                      <circle className={Styles.ringBg} cx="70" cy="70" r={radius} />
                      <circle className={Styles.ringFill} cx="70" cy="70" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: subjectColor }} />
                   </svg>
                   <div className={Styles.chartText}>
                      <div className={Styles.scoreLine}>
                        <span className={Styles.solvedBig}>{stats.totalUniqueSolved}</span>
                        <span className={Styles.totalSmall}>/{stats.totalQuestions}</span>
                      </div>
                      <div className={Styles.solvedLabel}><Check size={12} strokeWidth={4} /> Solved</div>
                   </div>
                </div>
                <div className={Styles.statColumn}>
                   <div className={Styles.statBox}>
                      <span className={Styles.mainsLabel}>Mains</span>
                      <span className={Styles.statValue}>{stats.uniqueSolvedMainQuestions}/{stats.totalMainQuestions}</span>
                   </div>
                   <div className={Styles.statBox}>
                      <span className={Styles.advancedLabel}>Advanced</span>
                      <span className={Styles.statValue}>{stats.uniqueSolvedAdvancedQuestions}/{stats.totalAdvancedQuestions}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </aside>

      <main className={Styles.content}>
        <div className={Styles.listHeader}>
          <div className={Styles.headerControls}>
            <div className={Styles.searchContainer}>
              <Search size={16} className={Styles.searchIcon} />
              <input type="text" placeholder="Search questions..." className={Styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className={Styles.filterContainer} ref={filterRef}>
              <button 
                className={`${Styles.filterToggleBtn} ${activeFilterCount > 0 ? Styles.filterActive : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={14} />
                <span>Filter</span>
                {activeFilterCount > 0 && <span className={Styles.filterBadge}>{activeFilterCount}</span>}
              </button>

              {isFilterOpen && (
                <div className={Styles.filterPopover}>
                  <div className={Styles.popoverHeader}>
                    <h4>Filters</h4>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className={Styles.clearBtn} title="Reset filters" aria-label="Reset filters">
                        <RotateCcw size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  {/* 1. YEAR: DROPDOWN */}
                  {availableYears.length > 0 && (
                    <div className={Styles.filterGroup}>
                      <label>Year</label>
                      <div className={Styles.dropdownContainer} data-dropdown>
                        <button className={Styles.dropdownTrigger} onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}>
                          <span className={Styles.dropdownValue}>
                            {selectedYears.length === 0 ? "All Years" : selectedYears.length === 1 ? selectedYears[0] : `${selectedYears.length} selected`}
                          </span>
                          <ChevronDown size={14} className={`${Styles.chevron} ${openDropdown === 'year' ? Styles.chevronOpen : ''}`} />
                        </button>
                        {openDropdown === 'year' && (
                          <div className={Styles.dropdownMenu}>
                            {availableYears.map(yr => (
                              <label key={yr} className={Styles.dropdownItem}>
                                <input type="checkbox" className={Styles.checkbox} checked={selectedYears.includes(yr)} onChange={() => setSelectedYears(prev => prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr])} />
                                <span>{yr}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. SESSION: PILLS/CHIPS */}
                  {selectedYears.length > 0 && availableSessions.length > 0 && (
                    <div className={Styles.filterGroup}>
                      <label>Session</label>
                      <div className={Styles.pillGroup}>
                        {availableSessions.map(sess => {
                          const isSelected = selectedSessions.includes(sess);
                          return (
                            <button 
                              key={sess} 
                              className={`${Styles.pillBtn} ${isSelected ? Styles.pillActive : ''}`}
                              onClick={() => setSelectedSessions(prev => isSelected ? prev.filter(s => s !== sess) : [...prev, sess])}
                            >
                              {sess.replace(/_/g, ' ')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. DATE: DROPDOWN */}
                  {selectedSessions.length > 0 && availableDates.length > 0 && (
                    <div className={Styles.filterGroup}>
                      <label>Date</label>
                      <div className={Styles.dropdownContainer} data-dropdown>
                        <button className={Styles.dropdownTrigger} onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}>
                          <span className={Styles.dropdownValue}>
                            {selectedDates.length === 0 ? "All Dates" : selectedDates.length === 1 ? selectedDates[0] : `${selectedDates.length} selected`}
                          </span>
                          <ChevronDown size={14} className={`${Styles.chevron} ${openDropdown === 'date' ? Styles.chevronOpen : ''}`} />
                        </button>
                        {openDropdown === 'date' && (
                          <div className={Styles.dropdownMenu}>
                            {availableDates.map(dateStr => (
                              <label key={dateStr} className={Styles.dropdownItem}>
                                <input type="checkbox" className={Styles.checkbox} checked={selectedDates.includes(dateStr)} onChange={() => setSelectedDates(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr])} />
                                <span>{dateStr}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. SHIFT: PILLS/CHIPS */}
                  {selectedDates.length > 0 && availableShifts.length > 0 && (
                    <div className={Styles.filterGroup}>
                      <label>Shift</label>
                      <div className={Styles.pillGroup}>
                        {availableShifts.map(shift => {
                          const isSelected = selectedShifts.includes(shift);
                          return (
                            <button 
                              key={shift} 
                              className={`${Styles.pillBtn} ${isSelected ? Styles.pillActive : ''}`}
                              onClick={() => setSelectedShifts(prev => isSelected ? prev.filter(s => s !== shift) : [...prev, shift])}
                            >
                              {shift}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          <div className={Styles.filterTabs}>
            <button className={`${Styles.filterBtn} ${activeFilter === 'Main' ? Styles.activeFilter : ''}`} onClick={() => { setActiveFilter('Main'); clearFilters(); setSearchQuery(''); }}>JEE Main</button>
            <button className={`${Styles.filterBtn} ${activeFilter === 'Advanced' ? Styles.activeFilter : ''}`} onClick={() => { setActiveFilter('Advanced'); clearFilters(); setSearchQuery(''); }}>JEE Advanced</button>
          </div>
        </div>

        <div className={Styles.list}>
          {activeQuestions && activeQuestions.length > 0 ? (
            activeQuestions.map((q, index) => {
              const isSuccess = q.attemptStatus === "Successfully attempted";
              const plainTextContent = prepareForPreview(q.content);
              return (
                <Link key={q.id} href={`/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?type=${activeFilter.toLowerCase()}&q=${q.id}`} className={Styles.row}>
                  <div className={Styles.rowLeft}>
                      <div className={Styles.statusIcon}>
                        {isSuccess ? <Check size={16} strokeWidth={3} className={Styles.iconSuccess} /> : <span className={Styles.iconEmpty}></span>}
                      </div>
                      <span className={Styles.qText}>
                        {index + 1}. {plainTextContent.length === 0 ? <span className="italic text-gray-500">Image Based Question</span> : <Latex>{plainTextContent}</Latex>}
                      </span>
                  </div>
                  <div className={Styles.rowRight}>
                      {q.papers && <span className={Styles.yearTag}>{q.papers.year}</span>}
                      <span className={Styles.tag}>{q.type === 'SingleCorrect' ? 'Single Choice' : 'Numerical'}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className={Styles.emptyState}>
              <p>No matching questions found.</p>
              {activeFilterCount > 0 && <button onClick={clearFilters} className={Styles.clearStateBtn}>Clear Filters</button>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};