'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Styles from '../jeeAdvanced.module.css'; 
import { usePaperStore } from "@/store/paperStore";
import TestListSection2, { TestListItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import StartTestPopup from '@/components/popups/StartTestPopup/StartTestPopup';
import { Loader } from "@/components/ui/loader";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeAdvancedYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); 
  
  const { papers, isLoading, error, getPapers } = usePaperStore();

  const [selectedTest, setSelectedTest] = useState<TestListItem | null>(null);
  const [isResume, setIsResume] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (year) {
      // Pass 'JEE_ADVANCED' here to fetch the correct papers
      getPapers(year, 'JEE_ADVANCED');
    }
  }, [year, getPapers]);

  // Transform Data
  const formattedItems = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Advanced ${paper.year} ${paper.date || ''} ${paper.shift || ''}`,
    meta: `Full Test • ${paper.totalMarks} Marks`,
    // Route to the advanced section
    href: `/previous-year-questions/jee-advanced/${year}/tests/${paper.id}` 
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

  if (isLoading) {
    return (
      <div className={Styles.jeeAdvancedPage}>
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
      <div className={Styles.jeeAdvancedPage}>
        <div className={Styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={() => getPapers(year, 'JEE_ADVANCED')} className={Styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  if (!formattedItems || formattedItems.length === 0) {
    return (
      <div className={Styles.jeeAdvancedPage}>
        <p className={Styles.emptyMessage}>Papers for JEE Advanced {year} are not available yet.</p>
      </div>
    );
  }

  return (
    <div className={Styles.jeeAdvancedPage}>
      <TestListSection2 
        heading={`JEE Advanced ${year}`} 
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