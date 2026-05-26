'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import TestListSection2, { TestCardItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import { fetchPaperAttemptsDetails, createTestSession, PaperAttemptDetail } from "@/features/tests/api";
import Styles from './previousYearQuestions.module.css';

// 🚨 NEW: Import Rate Limit Store and Modal
import { RateLimitModal } from '@/components/ui/RateLimitModal/RateLimitModal';
import { useRateLimitStore } from '@/store/useRateLimitStore';

const MAIN_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"];
const ADV_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];

export default function UnifiedPreviousYearQuestions() {
  const router = useRouter();

  // 🚨 NEW: Listen to rate limit state
  const { isRateLimited } = useRateLimitStore();

  // --- STATE ---
  const [examType, setExamType] = useState<'MAIN' | 'ADVANCED'>('MAIN');
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [papersWithStatus, setPapersWithStatus] = useState<PaperAttemptDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- DERIVED CONSTANTS ---
  const isMains = examType === 'MAIN';
  const apiExamType = isMains ? "JEE_MAIN" : "JEE_ADVANCED";
  const displayTitle = isMains ? "JEE Main" : "JEE Advanced";
  const currentYearOptions = isMains ? MAIN_YEARS : ADV_YEARS;
  const examPath = isMains ? 'jee-mains' : 'jee-advanced';

  // Synchronize year array boundaries on toggle
  useEffect(() => {
    if (examType === 'MAIN' && !MAIN_YEARS.includes(selectedYear)) setSelectedYear(MAIN_YEARS[0]);
    if (examType === 'ADVANCED' && !ADV_YEARS.includes(selectedYear)) setSelectedYear(ADV_YEARS[0]);
  }, [examType, selectedYear]);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function loadData() {
      if (!selectedYear) return;
      setIsLoading(true);
      try {
        const res = await fetchPaperAttemptsDetails(apiExamType, selectedYear);
        if (res.success && res.data) {
          setPapersWithStatus(res.data);
        } else {
          // Check if we are rate limited before showing generic toast
          if (!useRateLimitStore.getState().isRateLimited) {
            toast.error("Couldn't load papers. Try refreshing.");
          }
          setPapersWithStatus([]);
        }
      } catch (e) {
        console.error("Fetch failed", e);
        // 🚨 FIX: Don't show generic toast if the 429 modal is taking over
        if (!useRateLimitStore.getState().isRateLimited) {
          toast.error("Network issue. Please check your connection.");
        }
        setPapersWithStatus([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedYear, apiExamType]);

  // --- RENDERING PARSE UI ---
  const formattedItems: TestCardItem[] = React.useMemo(() => {
    return papersWithStatus.map((paper) => {
      let status: TestCardItem["status"] = "NOT_ATTEMPTED";
      if (paper.latestAttempt) status = paper.latestAttempt.status;
      else if (paper.attemptStatus === "completed") status = "COMPLETED";

      let title = "";
      if (isMains) {
        title = `${displayTitle} ${paper.year} ${paper.date} ${paper.month} (${paper.shift})`;
      } else {
        const shiftText = paper.shift ? `(${paper.shift})` : '';
        title = `${displayTitle} ${paper.year} ${paper.date || ''} ${paper.month || ''} ${shiftText}`.trim().replace(/\s+/g, ' ');
      }

      return {
        id: paper.paperId,
        title: title,
        meta: `Full Test • ${paper.totalMarks} Marks`,
        status: status,
        sessionId: paper.latestAttempt?.testId 
      };
    });
  }, [papersWithStatus, isMains, displayTitle]);

  // --- WORKSPACE CORE INTERFACES ---
  const handleStart = async (paperId: string) => {
    try {
      const res = await createTestSession(paperId);
      if (res.success && res.data?.testId) {
        router.push(`/previous-year-questions/${examPath}/${selectedYear}/tests/${paperId}?sid=${res.data.testId}`);
      } else {
        if (!useRateLimitStore.getState().isRateLimited) {
          toast.error("Couldn't start the test. Please try again.");
        }
      }
    } catch (e) {
      // 🚨 FIX: Suppress generic toast if rate limited
      if (!useRateLimitStore.getState().isRateLimited) {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(`/previous-year-questions/${examPath}/${selectedYear}/tests/${paperId}?sid=${sessionId}`);
  };

  const handleAnalytics = (paperId: string) => {
    router.push(`/analytics/tests/${paperId}`);
  };

  const handleSolutions = (paperId: string) => {
    router.push(`/solutions/${paperId}`);
  };

  return (
    <>
      {/* 🚨 THE RATE LIMIT MODAL */}
      <RateLimitModal />

      <div className={Styles.pageContainer}>
        <div className={Styles.splitLayout}>
          
          {/* LEFT SIDEBAR PANEL: Absolute Sticky Full Height */}
          <aside className={Styles.leftSidebar}>
            <div className={Styles.cardHeader}>
              <div className={Styles.iconSquare}>P</div>
              <div>
                <h1 className={Styles.cardTitle}>Past Papers</h1>
                <p className={Styles.cardSubtitle}>JEE Archive • Navigation</p>
              </div>
            </div>

            {/* Exam Segment Switcher */}
            <div className={Styles.segmentedControl}>
              <button 
                onClick={() => setExamType('MAIN')} 
                className={`${Styles.segmentBtn} ${examType === 'MAIN' ? Styles.segmentActive : ''}`}
              >
                JEE Main
              </button>
              <button 
                onClick={() => setExamType('ADVANCED')} 
                className={`${Styles.segmentBtn} ${examType === 'ADVANCED' ? Styles.segmentActive : ''}`}
              >
                JEE Advanced
              </button>
            </div>

            {/* Interactive Years List */}
            <div className={Styles.yearsListContainer}>
              <span className={Styles.listLabel}>Select Year</span>
              <div className={Styles.yearsList}>
                {currentYearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`${Styles.yearRowItem} ${selectedYear === year ? Styles.yearRowActive : ''}`}
                  >
                    <span className={Styles.yearNumberText}>{year}</span>
                    <span className={Styles.yearCountMeta}>
                      {isMains ? "20 Tests" : "2 Papers"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT TRACK */}
          <main className={Styles.rightContent}>
            {/* 🚨 FIX: Don't show loader if rate limited, let modal handle it */}
            {isLoading && !isRateLimited ? (
              <div className={Styles.centerState}>
                <Loader label={`Loading ${displayTitle} ${selectedYear} papers...`} />
              </div>
            ) : formattedItems.length > 0 ? (
              <div className={Styles.scrollContentWrapper}>
                <TestListSection2 
                  heading={`${displayTitle} ${selectedYear} Papers`} 
                  items={formattedItems} 
                  onStart={handleStart}
                  onResume={handleResume}
                  onRestart={handleStart}
                  onViewAnalytics={handleAnalytics}
                  onViewSolutions={handleSolutions}
                />
              </div>
            ) : (
              <div className={Styles.centerState}>
                <p className={Styles.emptyText}>Papers for {displayTitle} {selectedYear} are not available yet.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </>
  );
}