'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Styles from '../jeeAdvanced.module.css'; 
import TestListSection2, { TestCardItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import { Loader } from "@/components/ui/loader";
import { fetchPaperAttemptsDetails, createTestSession, PaperAttemptDetail } from "@/features/tests/api";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeAdvancedYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); 
  
  const [papersWithStatus, setPapersWithStatus] = useState<PaperAttemptDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Bulk Fetch Papers and Status on Mount for JEE ADVANCED
  useEffect(() => {
    async function loadData() {
      if (!year) return;
      setIsLoading(true);
      try {
        // Explicitly calling for JEE_ADVANCED
        const res = await fetchPaperAttemptsDetails("JEE_ADVANCED", year);
        if (res.success && res.data) {
          setPapersWithStatus(res.data);
        } else {
          toast.error("Failed to load papers.");
        }
      } catch (e) {
        console.error("Fetch failed", e);
        toast.error("Error connecting to server.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [year]);

  // 2. Transform Data directly for the Card UI
  const formattedItems: TestCardItem[] = papersWithStatus.map((paper) => {
    // Map backend status to our strict UI status
    let status: TestCardItem["status"] = "NOT_ATTEMPTED";
    
    if (paper.latestAttempt) {
       // The latest attempt overrides general status
       status = paper.latestAttempt.status;
    } else if (paper.attemptStatus === "completed") {
       status = "COMPLETED";
    }

    // Clean formatting for Advanced tests (which might not have specific shifts)
    const shiftText = paper.shift ? `(${paper.shift})` : '';
    const title = `JEE Advanced ${paper.year} ${paper.date || ''} ${paper.month || ''} ${shiftText}`.trim().replace(/\s+/g, ' ');

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
        // Route specifically to jee-advanced player
        router.push(`/previous-year-questions/jee-advanced/${year}/tests/${paperId}?sid=${res.data.testId}`);
      } else {
        toast.error("Failed to start test session");
      }
    } catch (e) {
      toast.error("Error creating session");
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(`/previous-year-questions/jee-advanced/${year}/tests/${paperId}?sid=${sessionId}`);
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
      <div className={Styles.jeeAdvancedPage}>
        <div className="flex h-[60vh] w-full items-center justify-center">
           <Loader label="Loading papers..." size="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.jeeAdvancedPage}>
        <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center">
          <p className="text-lg text-gray-400 font-medium">
            Papers for JEE Advanced {year} are not available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.jeeAdvancedPage}>
      <TestListSection2 
        heading={`JEE Advanced ${year} Papers`} 
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