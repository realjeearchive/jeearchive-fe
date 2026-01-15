'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation'; // Import Router
import Styles from "../jeeMains.module.css";
import { usePaperStore } from "@/store/paperStore";
import TestListSection2, { TestListItem } from '@/components/testPlayer/TestListSection2/TestListSection2';
import StartTestPopup from '@/components/popups/StartTestPopup/StartTestPopup'

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default function JeeMainsYearPage(props: YearPageProps) {
  const { year } = use(props.params);
  const router = useRouter(); // Initialize Router
  
  // Store
  const { papers, isLoading, error, getPapers } = usePaperStore();

  // Local State for Popup
  const [selectedTest, setSelectedTest] = useState<TestListItem | null>(null);
  const [isResume, setIsResume] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch papers
  useEffect(() => {
    if (year) {
      getPapers(year);
    }
  }, [year, getPapers]);

  // Transform Data
  const formattedItems = papers.map((paper) => ({
    id: paper.id,
    title: `JEE Main ${paper.year} ${paper.date} ${paper.month} ${paper.shift}`,
    meta: `Full Test • ${paper.totalMarks} Marks`,
    // We still keep the href for SEO, but we intercept it on click
    href: `/previous-year-questions/jee-mains/${year}/tests/${paper.id}` 
  }));

  // --- HANDLERS ---

  // 1. When user clicks a test in the list
  const handleTestClick = (item: TestListItem) => {
    // Check Local Storage for existing progress
    const savedProgress = localStorage.getItem(`test_progress_${item.id}`);
    
    // Determine if it's a Resume or Start
    if (savedProgress) {
      setIsResume(true);
    } else {
      setIsResume(false);
    }

    setSelectedTest(item);
    setShowPopup(true);
  };

  // 2. When user confirms in the popup
  const handleConfirmStart = () => {
    if (selectedTest) {
      setShowPopup(false);
      // Navigate to the test page
      router.push(selectedTest.href);
    }
  };

  // 3. Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTest(null);
  };


  // --- RENDERING STATES ---

  if (isLoading) {
    return (
      <div className={Styles.jeeMainsPage}>
        <div className={Styles.loadingContainer}><p>Loading papers...</p></div>
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
      {/* The List */}
      <TestListSection2 
        heading={`JEE Main ${year}`} 
        items={formattedItems} 
        onItemClick={handleTestClick} // Pass the interceptor
      />

      {/* The Popup Bridge */}
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