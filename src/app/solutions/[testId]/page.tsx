"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import { useRouter } from "next/navigation";

// --- Layout & Structure Components ---
import { SolutionLayout } from "@/components/solution-interface/layout/SolutionLayout";
import { SolutionHeader } from "@/components/solution-interface/layout/SolutionHeader";
import { SolutionSidebar } from "@/components/solution-interface/sidebar/SolutionSidebar";

// --- Question Components ---
import { QuestionMain } from "@/components/solution-interface/question/QuestionMain/QuestionMain";
import { QuestionHeader } from "@/components/solution-interface/question/QuestionHeader/QuestionHeader";
import { QuestionText } from "@/components/solution-interface/question/QuestionText/QuestionText";
import { OptionsList } from "@/components/solution-interface/question/OptionsList/OptionsList";
import { SolutionContent } from "@/components/solution-interface/question/SolutionContent/SolutionContent";
import { QuestionStats } from "@/components/solution-interface/question/QuestionStats/QuestionStats";
import { QuestionMeta } from "@/components/solution-interface/question/QuestionMeta/QuestionMeta";
import { Loader } from "@/components/ui/loader";

// --- Navigation Components ---
import { BottomBar } from "@/components/solution-interface/navigation/BottomBar";

// --- Store & Transformer ---
import { useSolutionStore } from "@/store/useSolutionStore";
import { transformSolutionData, Subject } from "@/features/solutions/solutionsTransformer";

interface PageProps {
  params: Promise<{ testId: string }>;
}

export default function SolutionPage(props: PageProps) {
  const { testId } = use(props.params);
  const router = useRouter();
  
  // 1. ZUSTAND STORE INTEGRATION
  const { rawSolutionData, isLoading, error, fetchData, clearData } = useSolutionStore();
  const TEST_DATA = useMemo(() => transformSolutionData(rawSolutionData), [rawSolutionData]);

  // 2. UI STATE MANAGEMENT
  const [activeSubject, setActiveSubject] = useState<Subject>("Physics");
  
  // FIX 1: We rename this to 'selected' and let React derive the 'active' one safely
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 3. EFFECTS
  useEffect(() => {
    if (testId) fetchData(testId);
    return () => clearData();
  }, [testId, fetchData, clearData]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 4. DERIVED DATA (FIXES CASCADING RENDER & TYPING ERRORS) ---

  const sidebarQuestions = useMemo(() => {
    if (!TEST_DATA) return [];
    return TEST_DATA.questions
      .filter((q) => q.subject === activeSubject)
      .map((q) => ({
        id: q.id,
        number: q.number,
        status: q.status,
        section: q.section
      }));
  }, [TEST_DATA, activeSubject]);

  // FIX 2: Dynamically calculate the active question ID. 
  // This guarantees it is ALWAYS a string, and automatically selects the first 
  // question if data just loaded OR if the user switched subjects.
  const activeQuestionId: string = useMemo(() => {
    if (!TEST_DATA || sidebarQuestions.length === 0) return "";
    
    // If the user previously selected a question, and it belongs to the current subject tab, keep it.
    const isSelectedValid = sidebarQuestions.some(q => q.id === selectedQuestionId);
    if (isSelectedValid && selectedQuestionId) {
      return selectedQuestionId;
    }
    
    // Otherwise, default to the first question in the sidebar
    return sidebarQuestions[0].id;
  }, [sidebarQuestions, selectedQuestionId, TEST_DATA]);

  const currentQuestion = useMemo(() => {
    if (!TEST_DATA || !activeQuestionId) return null;
    return TEST_DATA.questions.find((q) => q.id === activeQuestionId);
  }, [TEST_DATA, activeQuestionId]);

  // --- 5. EVENT HANDLERS ---

  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
    // Notice: We don't need to manually set the question ID here anymore! 
    // The activeQuestionId useMemo automatically handles the fallback.
  };

  const handleNext = () => {
    if (!TEST_DATA || !activeQuestionId) return;
    const currentIndex = TEST_DATA.questions.findIndex(q => q.id === activeQuestionId);
    
    if (currentIndex < TEST_DATA.questions.length - 1) {
      const nextQ = TEST_DATA.questions[currentIndex + 1];
      if (nextQ.subject !== activeSubject) {
        setActiveSubject(nextQ.subject);
      }
      setSelectedQuestionId(nextQ.id); 
    }
  };

  const handlePrev = () => {
    if (!TEST_DATA || !activeQuestionId) return;
    const currentIndex = TEST_DATA.questions.findIndex(q => q.id === activeQuestionId);
    
    if (currentIndex > 0) {
      const prevQ = TEST_DATA.questions[currentIndex - 1];
      if (prevQ.subject !== activeSubject) {
        setActiveSubject(prevQ.subject);
      }
      setSelectedQuestionId(prevQ.id);
    }
  };

  // --- 6. RENDER LOADING & ERROR STATES ---
  
if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--dashboard-background-color)]">
        <Loader label="Loading detailed solutions..." />
      </div>
    );
  }

  if (error || !TEST_DATA || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 bg-[var(--dashboard-background-color)] gap-4">
        <p className="text-sm font-medium">{error || "Solution data not available."}</p>
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2 border border-[#f59e0b] text-[#f59e0b] text-sm font-medium rounded-md hover:bg-[#f59e0b] hover:text-white transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  // --- 7. RENDER MAIN INTERFACE ---
  
  return (
    <SolutionLayout
      isSidebarOpen={isSidebarOpen} 
      onCloseSidebar={() => setIsSidebarOpen(false)}
      
      header={
        <SolutionHeader 
          testName={TEST_DATA.name}
          activeSubject={activeSubject}
          onSubjectChange={handleSubjectChange}
          onBack={() => router.back()}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      }
      
      sidebar={
        <SolutionSidebar 
          subjectName={activeSubject}
          questions={sidebarQuestions}
          activeQuestionId={activeQuestionId} // <--- NO MORE TYPE ERROR HERE!
          onQuestionClick={(id) => {
            setSelectedQuestionId(id); // Use the state setter here
            if (window.innerWidth <= 1024) setIsSidebarOpen(false);
          }}
          onClose={() => setIsSidebarOpen(false)}
        />
      }
      
      footer={
        <BottomBar 
          onNext={handleNext}
          onPrev={handlePrev}
          disablePrev={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === 0}
          disableNext={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === TEST_DATA.questions.length - 1}
        />
      }
    >
      <QuestionMain status={currentQuestion.status}>
        
        <QuestionHeader 
          qNumber={sidebarQuestions.findIndex(q => q.id === currentQuestion.id) + 1}
          type={currentQuestion.section}
          marksPos={currentQuestion.meta.marksPos}
          marksNeg={currentQuestion.meta.marksNeg}
        />

        {/* 🔥 NEW: Render Comprehension Passage if it exists */}
        {currentQuestion.comprehensionContent && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.05)',
            borderLeft: '4px solid #3b82f6',
            padding: '16px',
            marginBottom: '20px',
            borderRadius: '0 8px 8px 0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '8px' }}>
              Passage
            </div>
            <QuestionText content={currentQuestion.comprehensionContent} />
          </div>
        )}

        <QuestionText 
          content={currentQuestion.text}
          hasImage={currentQuestion.hasImage}
          imageUrl={currentQuestion.imageUrl}
        />

        {currentQuestion.section.includes("Correct") ? (
          <OptionsList 
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            userAnswer={currentQuestion.userAnswer}
          />
        ) : (
          <div className="mb-6 p-5 rounded-lg border border-[var(--dashboard-dividerline-color)] bg-[var(--dashboard-card-background)]">
            <div className="flex flex-col gap-3">
              {currentQuestion.userAnswer && currentQuestion.userAnswer.length > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[var(--dashboard-secondary-text-color)] font-medium uppercase tracking-wider">Your Answer:</span>
                  <span className={`text-lg font-bold ${currentQuestion.status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                    {/* 🔥 Safely join numerical arrays */}
                    {currentQuestion.userAnswer.join(", ")}
                  </span>
                </div>
              ) : (
                <div className="text-[13px] text-[var(--dashboard-secondary-text-color)] font-medium uppercase tracking-wider">
                  Status: <span className="text-gray-500">Unattempted</span>
                </div>
              )}
              
              <div className="w-full h-[1px] bg-[var(--dashboard-dividerline-color)] my-1"></div>
              
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[var(--dashboard-secondary-text-color)] font-medium uppercase tracking-wider">Correct Answer:</span>
                <span className="text-lg font-bold text-green-500">
                  {/* 🔥 Safely join numerical arrays */}
                  {currentQuestion.correctAnswer.join(", ")}
                </span>
              </div>
            </div>
          </div>
        )}

        <QuestionMeta
          chapter={currentQuestion.chapter}
          topic={currentQuestion.topic}
        />

        <SolutionContent 
          solutionText={currentQuestion.solution}
        />

        <QuestionStats 
          userTime={currentQuestion.stats.userTime}
          avgTime={currentQuestion.stats.avgTime}
          accuracy={currentQuestion.stats.accuracy}
        />

      </QuestionMain>
    </SolutionLayout>
  );
}