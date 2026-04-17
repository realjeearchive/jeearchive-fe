'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChapterInfoResponse } from "@/features/chapterWise/api";
import Styles from './ChapterDashboard.module.css';
import { Play, Check, Search } from 'lucide-react';
import Latex from "@/components/testPlayer/Latex/Latex"; // 🔥 Imported your Latex component!

interface ChapterDashboardProps {
  data: ChapterInfoResponse;
  subject: string;
  chapterSlug: string;
  divisionSlug: string;
  chapterName: string;
}

// 🔥 Updated Helper: Safely prepares text for a single-line LaTeX preview
const prepareForPreview = (html: string) => {
  if (!html) return "";
  
  // 1. Strip HTML tags safely
  let text = html.replace(/<[^>]*>?/gm, '').trim();
  
  // 2. Convert Block Math ($$ or \[) to Inline Math ($) 
  // This prevents the LaTeX component from pushing math to a new line in the list preview.
  text = text.replace(/\$\$/g, '$').replace(/\\\[/g, '$').replace(/\\\]/g, '$');
  
  // Notice we no longer hard-truncate the string. 
  // This prevents cutting a LaTeX formula in half and crashing KaTeX.
  // Your CSS `text-overflow: ellipsis` handles the visual truncation perfectly!
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

  const { stats, jeeMain, jeeAdvanced } = data;
  
  const baseQuestions = activeFilter === 'Main' ? jeeMain : jeeAdvanced;
  
  const sortedBaseQuestions = [...baseQuestions].sort((a, b) => {
    const numA = a.questionNumber || 0;
    const numB = b.questionNumber || 0;
    return numA - numB;
  });

  const activeQuestions = sortedBaseQuestions.filter((q, index) => {
    if (!searchQuery) return true; 
    
    const query = searchQuery.toLowerCase();
    const plainText = q.content ? q.content.replace(/<[^>]*>?/gm, '').trim().toLowerCase() : '';
    const qNum = (index + 1).toString(); 
    
    return plainText.includes(query) || qNum.includes(query);
  });
  
  // Circular Progress Calculations
  const radius = 64; 
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = stats.totalQuestions > 0 
    ? (stats.totalUniqueSolved / stats.totalQuestions) * 100 
    : 0;
  const offset = circumference - (progressPercentage / 100) * circumference;

  const getSubjectColor = () => {
    const s = subject.toLowerCase();
    if (s.includes('physic')) return 'var(--dashboard-physics-color)';
    if (s.includes('chemis')) return 'var(--dashboard-chemistry-color)';
    if (s.includes('math')) return 'var(--dashboard-maths-color)';
    return 'var(--dashboard-core-color)';
  };

  const subjectColor = getSubjectColor();

  return (
    <div className={Styles.container}>
      {/* LEFT SIDEBAR: The Progress Card */}
      <aside className={Styles.sidebar}>
        <div className={Styles.card}>
          <div className={Styles.iconBox}>
            <span className={Styles.iconLetter} style={{ color: subjectColor }}>
              {subject.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h1 className={Styles.title}>{chapterName}</h1>
          <p className={Styles.subtitle}>JEE Archive • {stats.totalQuestions} Questions</p>

          <Link 
            href={`/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?type=${activeFilter.toLowerCase()}`} 
            className={Styles.practiceBtn}
          >
            <Play size={16} fill="currentColor" strokeWidth={1} />
            Practice {activeFilter}
          </Link>

          <div className={Styles.progressContainer}>
             <div className={Styles.progressHeader}>
                <span>Progress</span>
             </div>

             <div className={Styles.progressContent}>
                {/* Circular Chart */}
                <div className={Styles.chartWrapper}>
                   <svg className={Styles.svgRing} viewBox="0 0 140 140">
                      <circle 
                        className={Styles.ringBg} 
                        cx="70" cy="70" r={radius} 
                      />
                      <circle 
                        className={Styles.ringFill} 
                        cx="70" cy="70" r={radius} 
                        style={{ 
                            strokeDasharray: circumference, 
                            strokeDashoffset: offset,
                            stroke: subjectColor
                        }}
                      />
                   </svg>
                   <div className={Styles.chartText}>
                      <div className={Styles.scoreLine}>
                        <span className={Styles.solvedBig}>{stats.totalUniqueSolved}</span>
                        <span className={Styles.totalSmall}>/{stats.totalQuestions}</span>
                      </div>
                      <div className={Styles.solvedLabel}>
                         <Check size={12} strokeWidth={4} /> Solved
                      </div>
                   </div>
                </div>

                {/* Difficulty/Type Stats */}
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

      {/* RIGHT SIDE: Borderless List Layout */}
      <main className={Styles.content}>
        <div className={Styles.listHeader}>
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

          <div className={Styles.filterTabs}>
            <button 
              className={`${Styles.filterBtn} ${activeFilter === 'Main' ? Styles.activeFilter : ''}`}
              onClick={() => { setActiveFilter('Main'); setSearchQuery(''); }}
            >
              JEE Main
            </button>
            <button 
              className={`${Styles.filterBtn} ${activeFilter === 'Advanced' ? Styles.activeFilter : ''}`}
              onClick={() => { setActiveFilter('Advanced'); setSearchQuery(''); }}
            >
              JEE Advanced
            </button>
          </div>
        </div>

        <div className={Styles.list}>
          {activeQuestions && activeQuestions.length > 0 ? (
            activeQuestions.map((q, index) => {
              const isSuccess = q.attemptStatus === "Successfully attempted";

              const plainTextContent = prepareForPreview(q.content);
              const isImageOnly = plainTextContent.length === 0;

              return (
                <Link 
                    key={q.id}
                    href={`/chapter-wise-questions/${subject}/${divisionSlug}/${chapterSlug}/practice?type=${activeFilter.toLowerCase()}&q=${q.id}`} 
                    className={Styles.row}
                >
                  <div className={Styles.rowLeft}>
                      <div className={Styles.statusIcon}>
                        {isSuccess ? (
                          <Check size={16} strokeWidth={3} className={Styles.iconSuccess} />
                        ) : (
                          <span className={Styles.iconEmpty}></span>
                        )}
                      </div>
                      
                      {/* 🔥 Render through your Latex component! */}
                      <span className={Styles.qText}>
                        {index + 1}. {isImageOnly ? (
                          <span className="italic text-gray-500">Image Based Question</span>
                        ) : (
                          <Latex>{plainTextContent}</Latex>
                        )}
                      </span>
                      
                  </div>
                  <div className={Styles.rowRight}>
                      <span className={Styles.tag}>
                        {q.type === 'SingleCorrect' ? 'Single Choice' : 'Numerical'}
                      </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className={Styles.emptyState}>
              <p>No questions found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};