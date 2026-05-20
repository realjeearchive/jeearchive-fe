'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Styles from "./yearPage.module.css"; 
import TestListSection2, { TestCardItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import { Loader } from "@/components/ui/loader";
import { fetchPaperAttemptsDetails, createTestSession, PaperAttemptDetail } from "@/features/tests/api";

interface YearPageProps {
  params: Promise<{ examType: string; year: string }>;
}

export default function UnifiedYearPage(props: YearPageProps) {
  const { examType, year } = use(props.params);
  const router = useRouter(); 
  
  const [papersWithStatus, setPapersWithStatus] = useState<PaperAttemptDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isMains = examType === 'jee-mains';
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

  const handleStart = async (paperId: string) => {
    try {
      const res = await createTestSession(paperId);
      if (res.success && res.data?.testId) {
        router.push(`/previous-year-questions/${examType}/${year}/tests/${paperId}?sid=${res.data.testId}`);
      } else {
        toast.error("Couldn't start the test. Please try again.");
      }
    } catch (e) {
      toast.error("No internet? Check your connection and retry.");
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(`/previous-year-questions/${examType}/${year}/tests/${paperId}?sid=${sessionId}`);
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
      <div className={Styles.pageContainer}>
         <div className={Styles.centerContent}>
           <Loader label={`Loading ${displayTitle} papers...`} />
         </div>
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.pageContainer}>
        <div className={Styles.centerContent}>
          <p style={{ color: 'var(--dashboard-secondary-text-color)', fontSize: '15px' }}>
            Papers for {displayTitle} {year} are not available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.pageContainer}>
      <TestListSection2 
        heading={`${displayTitle} ${year} Papers`} 
        items={formattedItems} 
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
        onViewAnalytics={handleAnalytics}
        onViewSolutions={handleSolutions}
      />
    </div>
  );
}