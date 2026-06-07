"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import TestListSection2, {
  TestCardItem,
} from "@/components/testPlayer/TestListSection2/TestListSection2";
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
  "2019", "2018", "2017", "2016", "2015", "2014",
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
  
  // 🔥 FIX: Progressive cache to store the test counts dynamically as they are fetched
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
          // Save the actual count to our dictionary state
          setYearCounts(prev => ({ ...prev, [`${apiExamType}_${selectedYear}`]: res.data.length }));
        } else {
          if (!useRateLimitStore.getState().isRateLimited) {
            toast.error("Couldn't load papers. Try refreshing.");
          }
          setPapersWithStatus([]);
          // Record 0 if the fetch succeeds but yields no data
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
      // 1. Sort by Session (e.g., Session_1 comes before Session_2)
      const sessionA = a.session || "";
      const sessionB = b.session || "";
      if (sessionA !== sessionB) return sessionA.localeCompare(sessionB);

      // 2. Sort by Month (January -> December)
      const months: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
      };
      const monthA = months[a.month?.toLowerCase()] || 99;
      const monthB = months[b.month?.toLowerCase()] || 99;
      if (monthA !== monthB) return monthA - monthB;

      // 3. Sort by Date numerically
      const dateA = parseInt(a.date) || 0;
      const dateB = parseInt(b.date) || 0;
      if (dateA !== dateB) return dateA - dateB;

      // 4. Sort by Shift (Morning / Shift 1 comes before Evening / Shift 2)
      const shiftA = a.shift?.toLowerCase() || "";
      const shiftB = b.shift?.toLowerCase() || "";
      if (shiftA !== shiftB) {
        const isMorningA = shiftA.includes("morning") || shiftA.includes("1");
        const isMorningB = shiftB.includes("morning") || shiftB.includes("1");
        if (isMorningA && !isMorningB) return -1;
        if (!isMorningA && isMorningB) return 1;
        return shiftA.localeCompare(shiftB);
      }

      return 0; // Exactly the same
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

  // 🔥 FIX: Receive sessionId instead of paperId
  const handleAnalytics = (sessionId: string) => {
    router.push(`/analytics/tests/${sessionId}`);
  };

  // 🔥 FIX: Receive sessionId instead of paperId
  const handleSolutions = (sessionId: string) => {
    router.push(`/solutions/${sessionId}`);
  };

  return (
    <>
      <RateLimitModal />

      <main className={Styles.pageContainer} aria-label="Previous year JEE question papers">
        {/* Breadcrumb Structured Data */}
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

        {/* ItemList Structured Data for the listing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: formattedItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "LearningResource",
                  name: item.title,
                  url: `https://jeearchive.com/previous-year-questions/${examPath}/${selectedYear}/tests/${item.id}`,
                  educationalLevel: "Higher Secondary",
                  about: {
                    "@type": "Thing",
                    name: `${displayTitle} PYQ`,
                  },
                },
              })),
            }),
          }}
        />

        <div className={Styles.splitLayout}>
          {/* LEFT SIDEBAR PANEL */}
          <aside className={Styles.leftSidebar} aria-label="Year and exam type filter">
            <div className={Styles.cardHeader}>
              <div className={Styles.iconSquare} aria-hidden="true">
                P
              </div>
              <div>
                <h1 className={Styles.cardTitle}>Past Papers</h1>
                <p className={Styles.cardSubtitle}>JEE Archive • Navigation</p>
              </div>
            </div>

            {/* Exam Segment Switcher */}
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

            {/* Interactive Years List */}
            <nav className={Styles.yearsListContainer} aria-label="Select year">
              <span className={Styles.listLabel}>Select Year</span>
              <div className={Styles.yearsList}>
                {currentYearOptions.map((year) => {
                  // 🔥 FIX: Check dictionary cache for dynamic counts
                  const countKey = `${apiExamType}_${year}`;
                  const count = yearCounts[countKey];
                  const baseLabel = isMains ? "Tests" : "Papers";
                  
                  // Pluralization handling (e.g. 1 Test vs 2 Tests)
                  const displayMeta = count !== undefined 
                    ? `${count} ${count === 1 ? baseLabel.slice(0, -1) : baseLabel}` 
                    : baseLabel;

                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`${Styles.yearRowItem} ${selectedYear === year ? Styles.yearRowActive : ""}`}
                      aria-current={selectedYear === year ? "true" : undefined}
                    >
                      <span className={Styles.yearNumberText}>{year}</span>
                      <span className={Styles.yearCountMeta}>
                        {displayMeta}
                      </span>
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