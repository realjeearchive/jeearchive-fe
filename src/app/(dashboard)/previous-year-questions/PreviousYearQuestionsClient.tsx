"use client";


import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import dynamic from "next/dynamic";
import type { TestCardItem } from "@/components/testPlayer/TestListSection2/TestListSection2";

const TestListSection2 = dynamic(
  () => import("@/components/testPlayer/TestListSection2/TestListSection2"),
  { 
    ssr: false,
    loading: () => <Loader label="Loading papers..." />
  }
);
import {
  fetchPaperAttemptsDetails,
  createTestSession,
  PaperAttemptDetail,
} from "@/features/tests/api";
import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";
import Styles from "./previousYearQuestions.module.css";

const MAIN_YEARS = [
  "2026", "2025", "2024", "2023", "2022", "2021", "2020",
  "2019", "2018", "2017", "2016", "2015", "2014", "2013"
];
const ADV_YEARS = [
  "2026", "2025", "2024", "2023", "2022", "2021", "2020",
  "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012",
];

export function PreviousYearQuestionsClient() {
  const router = useRouter();
  const { isRateLimited } = useRateLimitStore();

  const [examType, setExamType] = useState<"MAIN" | "ADVANCED">("MAIN");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [papersWithStatus, setPapersWithStatus] = useState<PaperAttemptDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [yearCounts, setYearCounts] = useState<Record<string, number>>({});

  const isMains = examType === "MAIN";
  const apiExamType = isMains ? "JEE_MAIN" : "JEE_ADVANCED";
  const displayTitle = isMains ? "JEE Main" : "JEE Advanced";
  const currentYearOptions = isMains ? MAIN_YEARS : ADV_YEARS;
  const examPath = isMains ? "jee-mains" : "jee-advanced";

  useEffect(() => {
    if (examType === "MAIN" && !MAIN_YEARS.includes(selectedYear))
      setSelectedYear(MAIN_YEARS[0]);
    if (examType === "ADVANCED" && !ADV_YEARS.includes(selectedYear))
      setSelectedYear(ADV_YEARS[0]);
  }, [examType, selectedYear]);

  useEffect(() => {
    async function loadData() {
      if (!selectedYear) return;
      setIsLoading(true);
      try {
        const res = await fetchPaperAttemptsDetails(apiExamType, selectedYear);
        if (res.success && res.data) {
          setPapersWithStatus(res.data);
          setYearCounts(prev => ({ ...prev, [`${apiExamType}_${selectedYear}`]: res.data.length }));
        } else {
          if (!useRateLimitStore.getState().isRateLimited) {
            toast.error("Couldn't load papers. Try refreshing.");
          }
          setPapersWithStatus([]);
          setYearCounts(prev => ({ ...prev, [`${apiExamType}_${selectedYear}`]: 0 }));
        }
      } catch (e) {
        console.error("Fetch failed", e);
        if (!useRateLimitStore.getState().isRateLimited) {
          toast.error("Network issue. Please check your connection.");
        }
        setPapersWithStatus([]);
        setYearCounts(prev => ({ ...prev, [`${apiExamType}_${selectedYear}`]: 0 }));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedYear, apiExamType]);

  const formattedItems: TestCardItem[] = React.useMemo(() => {
    const sortedPapers = [...papersWithStatus].sort((a, b) => {
      const sessionA = a.session || "";
      const sessionB = b.session || "";
      if (sessionA !== sessionB) return sessionA.localeCompare(sessionB);

      const months: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
      };
      const monthA = months[a.month?.toLowerCase()] || 99;
      const monthB = months[b.month?.toLowerCase()] || 99;
      if (monthA !== monthB) return monthA - monthB;

      const dateA = parseInt(a.date) || 0;
      const dateB = parseInt(b.date) || 0;
      if (dateA !== dateB) return dateA - dateB;

      const shiftA = a.shift?.toLowerCase() || "";
      const shiftB = b.shift?.toLowerCase() || "";
      if (shiftA !== shiftB) {
        const isMorningA = shiftA.includes("morning") || shiftA.includes("1");
        const isMorningB = shiftB.includes("morning") || shiftB.includes("1");
        if (isMorningA && !isMorningB) return -1;
        if (!isMorningA && isMorningB) return 1;
        return shiftA.localeCompare(shiftB);
      }

      return 0;
    });

    return sortedPapers.map((paper) => {
      let status: TestCardItem["status"] = "NOT_ATTEMPTED";
      if (paper.latestAttempt) status = paper.latestAttempt.status;
      else if (paper.attemptStatus === "completed") status = "COMPLETED";

      let title = "";
      const sessionText = paper.session ? `${paper.session.replace('_', ' ')} - ` : "";

      if (isMains) {
        title = `${sessionText}${displayTitle} ${paper.year} ${paper.date} ${paper.month} (${paper.shift})`;
      } else {
        const shiftText = paper.shift ? `(${paper.shift})` : "";
        title = `${displayTitle} ${paper.year} ${paper.date || ""} ${paper.month || ""} ${shiftText}`
          .trim()
          .replace(/\s+/g, " ");
      }

      return {
        id: paper.paperId,
        title: title,
        meta: `Full Test • ${paper.totalMarks} Marks`,
        status: status,
        sessionId: paper.latestAttempt?.testId,
      };
    });
  }, [papersWithStatus, isMains, displayTitle]);

  const handleStart = async (paperId: string) => {
    try {
      const res = await createTestSession(paperId);
      if (res.success && res.data?.testId) {
        router.push(
          `/previous-year-questions/${examPath}/${selectedYear}/tests/${paperId}?sid=${res.data.testId}`
        );
      } else {
        if (!useRateLimitStore.getState().isRateLimited) {
          toast.error("Couldn't start the test. Please try again.");
        }
      }
    } catch (e) {
      if (!useRateLimitStore.getState().isRateLimited) {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(
      `/previous-year-questions/${examPath}/${selectedYear}/tests/${paperId}?sid=${sessionId}`
    );
  };

  const handleAnalytics = (sessionId: string) => {
    router.push(`/analytics/tests/${sessionId}`);
  };

  const handleSolutions = (sessionId: string) => {
    router.push(`/solutions/${sessionId}`);
  };

  return (
    <>
      <RateLimitModal />

      <main className={Styles.pageContainer} aria-label="Previous year JEE question papers">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://jeearchive.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Previous Year Questions",
                  item: "https://jeearchive.com/previous-year-questions",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${displayTitle} ${selectedYear}`,
                  item: `https://jeearchive.com/previous-year-questions/${examPath}/${selectedYear}`,
                },
              ],
            }),
          }}
        />

        <div className={Styles.splitLayout}>
          <aside className={Styles.leftSidebar} aria-label="Year and exam type filter">
            
            {/* EXACT LEETCODE STRUCTURE HEADER BLOCK */}
            <div className={Styles.leetcodeHeaderBlock}>
              <div className={Styles.graphicIconContainer}>
                {/* Meaningful Icon: An Archive/Past Paper Stack */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={Styles.premiumIconSvg}
                >
                  <path d="M4 6h16" opacity="0.3" strokeWidth="2.5"/>
                  <path d="M4 10h16" opacity="0.6" strokeWidth="2.5"/>
                  <path d="M5 14h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z" fill="currentColor" stroke="none"/>
                  <path d="M9 17.5h6" stroke="var(--bg-surface)" strokeWidth="1.5"/>
                </svg>
              </div>
              
              <div className={Styles.headerTextGroup}>
                <h1 className={Styles.cardTitle}>Past Papers</h1>
                <div className={Styles.metaInfoRow}>
                  <span>JEE Archive</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>{currentYearOptions.length} Years</span>
                  <span className={Styles.metaDivider}>•</span>
                  <span>Navigation</span>
                </div>
              </div>
            </div>

            <nav className={Styles.segmentedControl} aria-label="Exam type selection">
              <button
                onClick={() => setExamType("MAIN")}
                className={`${Styles.segmentBtn} ${examType === "MAIN" ? Styles.segmentActive : ""}`}
                aria-pressed={examType === "MAIN"}
              >
                JEE Main
              </button>
              <button
                onClick={() => setExamType("ADVANCED")}
                className={`${Styles.segmentBtn} ${examType === "ADVANCED" ? Styles.segmentActive : ""}`}
                aria-pressed={examType === "ADVANCED"}
              >
                JEE Advanced
              </button>
            </nav>

            <nav className={Styles.yearsListContainer} aria-label="Select year">
              <span className={Styles.listLabel}>Select Year</span>
              
              {/* NEW: TABS GRID DISPLAY FOR YEARS */}
              <div className={Styles.yearsGrid}>
                {currentYearOptions.map((year) => {
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`${Styles.yearTabBtn} ${selectedYear === year ? Styles.yearTabActive : ""}`}
                      aria-current={selectedYear === year ? "true" : undefined}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* RIGHT CONTENT */}
          <section className={Styles.rightContent} aria-label="Test papers list">
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
                <p className={Styles.emptyText}>
                  Papers for {displayTitle} {selectedYear} are not available yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}