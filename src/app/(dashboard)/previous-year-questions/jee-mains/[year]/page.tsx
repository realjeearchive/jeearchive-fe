'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Styles from "../jeeMains.module.css";
import { usePaperStore } from "@/store/paperStore";
import TestListSection2, { TestListItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import StartTestPopup from '@/components/popups/StartTestPopup/StartTestPopup';
// 1. Import the Loader
import { Loader } from "@/components/ui/loader";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeMainsYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); 
  
  const { papers, isLoading, error, getPapers } = usePaperStore();

  const [selectedTest, setSelectedTest] = useState<TestListItem | null>(null);
  const [isResume, setIsResume] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (year) {
      getPapers(year);
    }
  }, [year, getPapers]);

  const formattedItems = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Main ${paper.year} ${paper.date} ${paper.month} ${paper.shift}`,
    meta: `Full Test • ${paper.totalMarks} Marks`,
    href: `/previous-year-questions/jee-mains/${year}/tests/${paper.id}` 
  }));

  // --- HANDLERS ---
  const handleTestClick = (item: TestListItem) => {
    const savedProgress = localStorage.getItem(`test_progress_${item.id}`);
    
    if (savedProgress) {
      setIsResume(true);
    } else {
      setIsResume(false);
    }

    setSelectedTest(item);
    setShowPopup(true);
  };

  const handleConfirmStart = () => {
    if (selectedTest) {
      setShowPopup(false);
      router.push(selectedTest.href);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTest(null);
  };

  // --- RENDERING STATES ---

  // 2. Updated Loading State with Reusable Loader
  if (isLoading) {
    return (
      <div className={Styles.jeeMainsPage}>
        {/* We use inline flex styles here to guarantee centering without editing CSS modules */}
        <div 
          className={Styles.loadingContainer} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '60vh', 
            width: '100%' 
          }}
        >
           <Loader label="Loading papers..." size="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={Styles.jeeMainsPage}>
        <div className={Styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={() => getPapers(year)} className={Styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.jeeMainsPage}>
        <p className={Styles.emptyMessage}>Papers for JEE Main {year} are not available yet.</p>
      </div>
    );
  }

  return (
    <div className={Styles.jeeMainsPage}>
      <TestListSection2 
        heading={`JEE Main ${year}`} 
        items={formattedItems} 
        onItemClick={handleTestClick} 
      />

      <StartTestPopup 
        isOpen={showPopup}
        testTitle={selectedTest?.title || "Test"}
        isResume={isResume}
        onClose={handleClosePopup}
        onConfirm={handleConfirmStart}
      />
    </div>
  );
}