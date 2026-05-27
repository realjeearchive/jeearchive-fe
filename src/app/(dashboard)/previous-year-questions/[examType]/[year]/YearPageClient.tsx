"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Styles from "./yearPage.module.css";
import TestListSection2, {
  TestCardItem,
} from "@/components/testPlayer/TestListSection2/TestListSection2";
import { Loader } from "@/components/ui/loader";
import {
  fetchPaperAttemptsDetails,
  createTestSession,
  PaperAttemptDetail,
} from "@/features/tests/api";

interface YearPageClientProps {
  examType: string;
  year: string;
}

export function YearPageClient({ examType, year }: YearPageClientProps) {
  const router = useRouter();

  const [papersWithStatus, setPapersWithStatus] = useState<PaperAttemptDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isMains = examType === "jee-mains";
  const apiExamType = isMains ? "JEE_MAIN" : "JEE_ADVANCED";
  const displayTitle = isMains ? "JEE Main" : "JEE Advanced";

  useEffect(() => {
    async function loadData() {
      if (!year || !examType) return;
      setIsLoading(true);
      try {
        const res = await fetchPaperAttemptsDetails(apiExamType, year);
        if (res.success && res.data) {
          setPapersWithStatus(res.data);
        } else {
          toast.error("Couldn't load papers. Try refreshing the page.");
        }
      } catch (e) {
        console.error("Fetch failed", e);
        toast.error("No internet? Check your connection and refresh.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [year, examType, apiExamType]);

  const formattedItems: TestCardItem[] = papersWithStatus.map((paper) => {
    let status: TestCardItem["status"] = "NOT_ATTEMPTED";

    if (paper.latestAttempt) {
      status = paper.latestAttempt.status;
    } else if (paper.attemptStatus === "completed") {
      status = "COMPLETED";
    }

    let title = "";
    if (isMains) {
      title = `${displayTitle} ${paper.year} ${paper.date} ${paper.month} (${paper.shift})`;
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

  const handleStart = async (paperId: string) => {
    try {
      const res = await createTestSession(paperId);
      if (res.success && res.data?.testId) {
        router.push(
          `/previous-year-questions/${examType}/${year}/tests/${paperId}?sid=${res.data.testId}`
        );
      } else {
        toast.error("Couldn't start the test. Please try again.");
      }
    } catch (e) {
      toast.error("No internet? Check your connection and retry.");
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(
      `/previous-year-questions/${examType}/${year}/tests/${paperId}?sid=${sessionId}`
    );
  };

  const handleRestart = async (paperId: string) => {
    handleStart(paperId);
  };

  const handleAnalytics = (paperId: string) => {
    router.push(`/analytics/tests/${paperId}`);
  };

  const handleSolutions = (paperId: string) => {
    router.push(`/solutions/${paperId}`);
  };

  if (isLoading) {
    return (
      <main className={Styles.pageContainer} aria-label={`Loading ${displayTitle} ${year} papers`}>
        <div className={Styles.centerContent}>
          <Loader label={`Loading ${displayTitle} papers...`} />
        </div>
      </main>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <main className={Styles.pageContainer} aria-label={`No papers available for ${displayTitle} ${year}`}>
        <div className={Styles.centerContent}>
          <h1 style={{ color: "var(--dashboard-secondary-text-color)", fontSize: "15px" }}>
            Papers for {displayTitle} {year} are not available yet.
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className={Styles.pageContainer} aria-label={`${displayTitle} ${year} question papers`}>
      {/* BreadcrumbList Structured Data */}
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
                name: `${displayTitle} ${year}`,
                item: `https://jeearchive.com/previous-year-questions/${examType}/${year}`,
              },
            ],
          }),
        }}
      />

      <TestListSection2
        heading={`${displayTitle} ${year} Papers`}
        items={formattedItems}
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
        onViewAnalytics={handleAnalytics}
        onViewSolutions={handleSolutions}
      />
    </main>
  );
}