'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Styles from "../jeeMains.module.css";
import { usePaperStore } from "@/store/paperStore";
import TestListSection2, { TestListItem, TestStatusData } from '@/components/testPlayer/TestListSection2/TestListSection2';
import { Loader } from "@/components/ui/loader";
import { fetchLastTestStatus, createTestSession } from "@/features/tests/api";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeMainsYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); 
  
  const { papers, isLoading, getPapers } = usePaperStore();

  // --- ACCORDION STATE ---
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null); 
  const [currentTestStatus, setCurrentTestStatus] = useState<TestStatusData | null>(null);

  // 1. Fetch Papers on Mount
  useEffect(() => {
    if (year) {
      getPapers(year, 'JEE_MAIN');
    }
  }, [year, getPapers]);

  // 2. Transform Data
  const formattedItems: TestListItem[] = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Main ${paper.year} ${paper.date} ${paper.month} (${paper.shift})`,
    meta: `Full Test • ${paper.totalMarks} Marks`,
    href: `/previous-year-questions/jee-mains/${year}/tests/${paper.id}` 
  }));

  // 3. HANDLE EXPANSION (Check Status)
  const handleToggleExpand = async (paperId: string) => {
    if (expandedId === paperId) {
      setExpandedId(null);
      setCurrentTestStatus(null);
      return;
    }

    setExpandedId(paperId);
    setLoadingId(paperId);
    setCurrentTestStatus(null); 

    try {
      const res = await fetchLastTestStatus(paperId);
      if (res.success && res.data) {
        setCurrentTestStatus({
          // FIX: Use '|| null' to handle undefined safely without 'any'
          status: res.data.status || null, 
          testId: res.data.testId
        });
      } else {
        setCurrentTestStatus({ status: null });
      }
    } catch (e) {
      console.error("Status check failed", e);
      setCurrentTestStatus({ status: null });
    } finally {
      setLoadingId(null);
    }
  };

  // --- ACTIONS ---

  const handleStart = async (paperId: string) => {
    try {
      const res = await createTestSession(paperId);
      if (res.success && res.data?.testId) {
        router.push(`/previous-year-questions/jee-mains/${year}/tests/${paperId}?sid=${res.data.testId}`);
      } else {
        toast.error("Failed to start test session");
      }
    } catch (e) {
      toast.error("Error creating session");
    }
  };

  const handleResume = (paperId: string, sessionId: string) => {
    router.push(`/previous-year-questions/jee-mains/${year}/tests/${paperId}?sid=${sessionId}`);
  };

  const handleRestart = async (paperId: string) => {
    if(confirm("Are you sure you want to restart? Your previous progress will be lost.")) {
       handleStart(paperId); 
    }
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
      <div className={Styles.jeeMainsPage}>
        <div className="flex h-[60vh] w-full items-center justify-center">
           <Loader label="Loading papers..." size="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.jeeMainsPage}>
        <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center">
          <p className="text-lg text-gray-400 font-medium">
            Papers for JEE Main {year} are not available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection2 
        heading={`JEE Main ${year} Papers`} 
        items={formattedItems} 
        
        expandedId={expandedId}
        loadingId={loadingId}
        currentTestStatus={currentTestStatus}

        onToggleExpand={handleToggleExpand}
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
        onViewAnalytics={handleAnalytics}
        onViewSolutions={handleSolutions}
      />
    </div>
  );
}