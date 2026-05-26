'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChapterInfoResponse } from "@/features/chapterWise/api";
import Styles from './ChapterDashboard.module.css';

import Latex from "@/components/testPlayer/Latex/Latex";
import { Play, Check, Search, Filter, ChevronDown, RotateCcw, Calendar, Clock, Tag, Sun, Minus } from 'lucide-react';

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
  const [openDropdown, setOpenDropdown] = useState<'year' | 'session' | 'date' | 'shift' | null>(null);  
  
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const { stats, jeeMain, jeeAdvanced, chapterData } = data;
  const baseQuestions = activeFilter === 'Main' ? jeeMain : jeeAdvanced;

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(baseQuestions.map(q => q.papers?.year).filter(Boolean))) as number[];
    return years.sort((a, b) => b - a);
  }, [baseQuestions]);

  const availableSessions = useMemo(() => {
    const filtered = baseQuestions.filter(q => {
      return selectedYears.length === 0 || (q.papers?.year !== undefined && selectedYears.includes(q.papers.year));
    });
    return Array.from(new Set(filtered.map(q => q.papers?.session).filter(Boolean))) as string[];
  }, [baseQuestions, selectedYears]);

  const availableDates = useMemo(() => {
    const filtered = baseQuestions.filter(q => {
      const yMatch = selectedYears.length === 0 || (q.papers?.year !== undefined && selectedYears.includes(q.papers.year));
      const sMatch = selectedSessions.length === 0 || (q.papers?.session !== undefined && selectedSessions.includes(q.papers.session));
      return yMatch && sMatch;
    });
    const dates = filtered.map(q => q.papers?.date && q.papers?.month ? `${q.papers.date} ${q.papers.month}` : null).filter(Boolean) as string[];
    return Array.from(new Set(dates));
  }, [baseQuestions, selectedYears, selectedSessions]);

  const availableShifts = useMemo(() => {
    const filtered = baseQuestions.filter(q => {
      const yMatch = selectedYears.length === 0 || (q.papers?.year !== undefined && selectedYears.includes(q.papers.year));
      const sMatch = selectedSessions.length === 0 || (q.papers?.session !== undefined && selectedSessions.includes(q.papers.session));
      
      const dateStr = q.papers?.date && q.papers?.month ? `${q.papers.date} ${q.papers.month}` : null;
      const dMatch = selectedDates.length === 0 || (dateStr !== null && selectedDates.includes(dateStr));
      
      return yMatch && sMatch && dMatch;
    });
    return Array.from(new Set(filtered.map(q => q.papers?.shift).filter(Boolean))) as string[];
  }, [baseQuestions, selectedYears, selectedSessions, selectedDates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
        setOpenDropdown(null); 
      } else if (!target.closest('[data-dropdown]')) {
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

  const practiceUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('type', activeFilter.toLowerCase());
    
    if (selectedYears.length > 0) params.set('years', selectedYears.join(','));
    if (selectedSessions.length > 0) params.set('sessions', selectedSessions.join(','));
    if (selectedDates.length > 0) params.set('dates', selectedDates.join(','));
    if (selectedShifts.length > 0) params.set('shifts', selectedShifts.join(','));
    
    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  }, [activeFilter, selectedYears, selectedSessions, selectedDates, selectedShifts, subject, divisionSlug, chapterSlug]);

  const getQuestionUrl = (questionId: string) => {
    const params = new URLSearchParams();
    params.set('type', activeFilter.toLowerCase());
    params.set('q', questionId);
    
    if (selectedYears.length > 0) params.set('years', selectedYears.join(','));
    if (selectedSessions.length > 0) params.set('sessions', selectedSessions.join(','));
    if (selectedDates.length > 0) params.set('dates', selectedDates.join(','));
    if (selectedShifts.length > 0) params.set('shifts', selectedShifts.join(','));
    
    return `/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?${params.toString()}`;
  };

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
              {!chapterData.isJeeMain && !chapterData.isJeeAdvanced ? (
                <span className={Styles.badgeExcluded} style={{ width: 'fit-content' }}>
                  <Minus size={12} strokeWidth={3} /> Excluded Chapter
                </span>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          <Link 
            href={practiceUrl}
            className={Styles.practiceBtn}
          >
            <Play size={16} fill="currentColor" strokeWidth={1} />
            Practice {activeFilter}
          </Link>

          {/* 🔥 MOVED SEARCH BAR: Now perfectly matching the Bookmarks page */}
          <div className={Styles.sidebarSearchWrapper}>
            <span className={Styles.sectionLabel}>SEARCH</span>
            <div className={Styles.searchContainer}>
              <Search size={16} className={Styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                className={Styles.searchInput} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
          </div>

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
            
            {/* FILTER BUTTON */}
            <div className={Styles.lcFilterContainer} ref={filterRef}>
              <button 
                className={`${Styles.lcFilterToggle} ${activeFilterCount > 0 ? Styles.lcFilterActive : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} strokeWidth={2} />
                {activeFilterCount > 0 && <span className={Styles.lcFilterDot} />}
              </button>

              {isFilterOpen && (
                <div className={Styles.lcPopover}>
                  <div className={Styles.lcRowsContainer}>
                    {/* 1. YEAR ROW */}
                    {availableYears.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}><Calendar size={14} className={Styles.lcIcon}/> Year</div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div className={Styles.lcValueBox} onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}>
                            <span className={Styles.lcSelectedText}>
                              {selectedYears.length === 0 ? "Select year..." : selectedYears.length === 1 ? selectedYears[0] : `${selectedYears.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--dashboard-secondary-text-color)"/>
                          </div>
                          {openDropdown === 'year' && (
                            <div className={Styles.lcDropdownMenu}>
                              {availableYears.map(yr => (
                                <label key={yr} className={Styles.lcDropdownItem}>
                                  <input type="checkbox" className={Styles.lcCheckbox} checked={selectedYears.includes(yr)} onChange={() => setSelectedYears(prev => prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr])} />
                                  <span>{yr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <Minus size={16} className={Styles.lcRemoveIcon} onClick={() => setSelectedYears([])} />
                      </div>
                    )}

                    {/* 2. SESSION ROW */}
                    {selectedYears.length > 0 && availableSessions.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}><Clock size={14} className={Styles.lcIcon}/> Session</div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div className={Styles.lcValueBox} onClick={() => setOpenDropdown(openDropdown === 'session' ? null : 'session')}>
                            <span className={Styles.lcSelectedText}>
                              {selectedSessions.length === 0 ? "Select session..." : selectedSessions.length === 1 ? selectedSessions[0].replace(/_/g, ' ') : `${selectedSessions.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--dashboard-secondary-text-color)"/>
                          </div>
                          {openDropdown === 'session' && (
                            <div className={Styles.lcDropdownMenu}>
                              {availableSessions.map(sess => (
                                <label key={sess} className={Styles.lcDropdownItem}>
                                  <input type="checkbox" className={Styles.lcCheckbox} checked={selectedSessions.includes(sess)} onChange={() => setSelectedSessions(prev => prev.includes(sess) ? prev.filter(s => s !== sess) : [...prev, sess])} />
                                  <span>{sess.replace(/_/g, ' ')}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <Minus size={16} className={Styles.lcRemoveIcon} onClick={() => setSelectedSessions([])} />
                      </div>
                    )}

                    {/* 3. DATE ROW */}
                    {selectedSessions.length > 0 && availableDates.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}><Tag size={14} className={Styles.lcIcon}/> Date</div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div className={Styles.lcValueBox} onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}>
                            <span className={Styles.lcSelectedText}>
                              {selectedDates.length === 0 ? "Select date..." : selectedDates.length === 1 ? selectedDates[0] : `${selectedDates.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--dashboard-secondary-text-color)"/>
                          </div>
                          {openDropdown === 'date' && (
                            <div className={Styles.lcDropdownMenu}>
                              {availableDates.map(dateStr => (
                                <label key={dateStr} className={Styles.lcDropdownItem}>
                                  <input type="checkbox" className={Styles.lcCheckbox} checked={selectedDates.includes(dateStr)} onChange={() => setSelectedDates(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr])} />
                                  <span>{dateStr}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <Minus size={16} className={Styles.lcRemoveIcon} onClick={() => setSelectedDates([])} />
                      </div>
                    )}

                    {/* 4. SHIFT ROW */}
                    {selectedDates.length > 0 && availableShifts.length > 0 && (
                      <div className={Styles.lcRow}>
                        <div className={Styles.lcLabel}><Sun size={14} className={Styles.lcIcon}/> Shift</div>
                        <div className={Styles.lcValueWrapper} data-dropdown>
                          <div className={Styles.lcValueBox} onClick={() => setOpenDropdown(openDropdown === 'shift' ? null : 'shift')}>
                            <span className={Styles.lcSelectedText}>
                              {selectedShifts.length === 0 ? "Select shift..." : selectedShifts.length === 1 ? selectedShifts[0] : `${selectedShifts.length} selected`}
                            </span>
                            <ChevronDown size={14} color="var(--dashboard-secondary-text-color)"/>
                          </div>
                          {openDropdown === 'shift' && (
                            <div className={Styles.lcDropdownMenu}>
                              {availableShifts.map(shift => (
                                <label key={shift} className={Styles.lcDropdownItem}>
                                  <input type="checkbox" className={Styles.lcCheckbox} checked={selectedShifts.includes(shift)} onChange={() => setSelectedShifts(prev => prev.includes(shift) ? prev.filter(s => s !== shift) : [...prev, shift])} />
                                  <span>{shift}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <Minus size={16} className={Styles.lcRemoveIcon} onClick={() => setSelectedShifts([])} />
                      </div>
                    )}
                  </div>

                  <div className={Styles.lcFooter}>
                    <button onClick={clearFilters} className={Styles.lcResetBtn}>
                      <RotateCcw size={14} /> Reset Filters
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* TABS */}
            <div className={Styles.filterTabs}>
              <button className={`${Styles.filterBtn} ${activeFilter === 'Main' ? Styles.activeFilter : ''}`} onClick={() => { setActiveFilter('Main'); clearFilters(); setSearchQuery(''); }}>JEE Main</button>
              <button className={`${Styles.filterBtn} ${activeFilter === 'Advanced' ? Styles.activeFilter : ''}`} onClick={() => { setActiveFilter('Advanced'); clearFilters(); setSearchQuery(''); }}>JEE Advanced</button>
            </div>

          </div>
        </div>

        <div className={Styles.list}>
          {activeQuestions && activeQuestions.length > 0 ? (
            activeQuestions.map((q, index) => {
              const isSuccess = q.attemptStatus === "Successfully attempted";
              const plainTextContent = prepareForPreview(q.content);
              return (
                <Link 
                  key={q.id} 
                  href={getQuestionUrl(q.id)} 
                  className={Styles.row}
                >
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