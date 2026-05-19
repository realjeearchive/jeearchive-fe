'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
// Make sure to rename your CSS file to match this, or point it to your existing CSS file
import Styles from "../yearPage.module.css"; 
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

  // Derive constants based on the URL parameter
  const isMains = examType === 'jee-mains';
  const apiExamType = isMains ? "JEE_MAIN" : "JEE_ADVANCED";
  const displayTitle = isMains ? "JEE Main" : "JEE Advanced";

  // 1. Bulk Fetch Papers and Status on Mount
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

  // 2. Transform Data directly for the Card UI
  const formattedItems: TestCardItem[] = papersWithStatus.map((paper) => {
    let status: TestCardItem["status"] = "NOT_ATTEMPTED";
    
    if (paper.latestAttempt) {
       status = paper.latestAttempt.status;
    } else if (paper.attemptStatus === "completed") {
       status = "COMPLETED";
    }

    // Dynamic Title Formatting
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

  // --- ACTIONS ---
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

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className={Styles.pageContainer || "flex h-[60vh] w-full items-center justify-center"}>
         <Loader label={`Loading ${displayTitle} papers...`} size="h-6 w-6" />
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.pageContainer || "flex h-[50vh] w-full flex-col items-center justify-center text-center"}>
        <p className="text-lg text-gray-400 font-medium">
          Papers for {displayTitle} {year} are not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={Styles.pageContainer || ""}>
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