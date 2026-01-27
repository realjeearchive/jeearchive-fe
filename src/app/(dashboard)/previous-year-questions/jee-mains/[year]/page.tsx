'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Styles from "../jeeMains.module.css";
import { usePaperStore } from "@/store/paperStore";
import TestListSection2, { TestListItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import StartTestPopup from '@/components/popups/StartTestPopup/StartTestPopup';
import { Loader } from "@/components/ui/loader";
import { fetchLastTestStatus, createTestSession } from "@/features/tests/api";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeMainsYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); 
  
  // Store hooks
  const { papers, isLoading, error, getPapers } = usePaperStore();

  // --- POPUP STATE ---
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  
  // Logic State
  const [isChecking, setIsChecking] = useState(false);
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);
  const [isResume, setIsResume] = useState(false);

  // 1. Fetch Papers on Mount
  useEffect(() => {
    if (year) {
      getPapers(year, 'JEE_MAIN');
    }
  }, [year, getPapers]);

  // 2. Transform Data for UI
  const formattedItems: TestListItem[] = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Main ${paper.year} ${paper.date} ${paper.month} (${paper.shift})`,
    meta: `Full Test • ${paper.totalMarks} Marks`,
    href: `/previous-year-questions/jee-mains/${year}/tests/${paper.id}` 
  }));

  // 3. HANDLE CLICK: Check Status first
  const handleTestClick = async (item: TestListItem) => {
    setSelectedPaperId(item.id);
    setSelectedTitle(item.title);
    setIsChecking(true);
    
    try {
      const res = await fetchLastTestStatus(item.id);
      
      // If active session found (IN_PROGRESS or PAUSED), offer Resume
      if (res.success && res.data && res.data.testId && (res.data.status === "IN_PROGRESS" || res.data.status === "PAUSED")) {
        setIsResume(true);
        setExistingSessionId(res.data.testId);
      } else {
        setIsResume(false);
        setExistingSessionId(null);
      }
      
      setShowPopup(true);
    } catch (e) {
      console.error("Status check failed", e);
      // Fallback to fresh start if check fails
      setIsResume(false);
      setShowPopup(true);
    } finally {
      setIsChecking(false);
    }
  };

  // 4. ACTION: FRESH START / RESTART
  // Creates a NEW session ID and overwrites any old progress
  const handleStartOrRestart = async () => {
    if (!selectedPaperId) return;

    try {
      const res = await createTestSession(selectedPaperId);
      
      if (res.success && res.data?.testId) {
        setShowPopup(false);
        // Navigate to Instructions Page with NEW Session ID
        router.push(`/previous-year-questions/jee-mains/${year}/tests/${selectedPaperId}?sid=${res.data.testId}`);
      } else {
        throw new Error(res.message || "Failed to start test.");
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to create session");
    }
  };

  // 5. ACTION: RESUME
  // Uses the EXISTING session ID
  const handleResume = () => {
    if (!selectedPaperId || !existingSessionId) {
      toast.error("Cannot resume: Session ID missing.");
      return;
    }
    
    setShowPopup(false);
    // Navigate to Instructions Page with EXISTING Session ID
    router.push(`/previous-year-questions/jee-mains/${year}/tests/${selectedPaperId}?sid=${existingSessionId}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPaperId(null);
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

  // Empty State
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
      {isChecking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <Loader label="Checking Status..." size="h-6 w-6" />
        </div>
      )}

      <TestListSection2 
        heading={`JEE Main ${year} Papers`} 
        items={formattedItems} 
        onItemClick={handleTestClick} 
      />

      <StartTestPopup 
        isOpen={showPopup}
        testTitle={selectedTitle}
        isResume={isResume}
        onClose={handleClosePopup}
        onStart={handleStartOrRestart}
        onResume={handleResume}
        onRestart={handleStartOrRestart}
      />
    </div>
  );
}