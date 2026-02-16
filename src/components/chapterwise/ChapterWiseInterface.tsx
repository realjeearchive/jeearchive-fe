"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";

// Components
import { SolutionLayout } from "./layout/SolutionLayout";
import { SolutionHeader } from "./layout/SolutionHeader";
// Import QuestionStatus as SidebarItemStatus to avoid naming conflict
import { SolutionSidebar, QuestionStatus as SidebarItemStatus } from "./sidebar/SolutionSidebar"; 
import { BottomBar } from "./navigation/BottomBar";
import { QuestionMain } from "./question/QuestionMain/QuestionMain";
import { QuestionHeader } from "./question/QuestionHeader/QuestionHeader";
import { QuestionText } from "./question/QuestionText/QuestionText";
import { OptionsList } from "./question/OptionsList/OptionsList";
import { QuestionMeta } from "./question/QuestionMeta/QuestionMeta";
import { SolutionContent } from "./question/SolutionContent/SolutionContent";
import { QuestionStats } from "./question/QuestionStats/QuestionStats";

// --- TYPE DEFINITIONS ---
export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type SectionType = "Single Correct" | "Numerical" | "Multiple Correct";

// Renamed local status type to avoid conflict with Sidebar interface
export type StatusString = "correct" | "incorrect" | "unattempted";

export interface Option {
  id: string;
  text: string;
  percentage?: number;
}

export interface QuestionStatsData {
  userTime: string;
  avgTime: string;
  accuracy: number;
}

export interface QuestionMetaData {
  difficulty: "Easy" | "Medium" | "Hard";
  marksPos: number;
  marksNeg: number;
}

export interface QuestionData {
  id: string;
  number: number;
  subject: Subject;
  section: SectionType;
  text: string;
  hasImage?: boolean;
  imageUrl?: string;
  options: Option[];
  correctAnswer: string;
  userAnswer: string | null;
  status: StatusString; // Uses local string type
  solution: string;
  stats: QuestionStatsData;
  meta: QuestionMetaData;
  chapter: string;
  topic: string;
}

interface ChapterWiseInterfaceProps {
  questions: QuestionData[];
  chapterName: string;
  subject: string;
}

export const ChapterWiseInterface = ({ 
  questions, 
  chapterName, 
  subject 
}: ChapterWiseInterfaceProps) => {
  const router = useRouter();
  
  // --- STATE ---
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // --- DERIVED DATA ---
  const safeSubject = (["Physics", "Chemistry", "Mathematics"].includes(subject) 
    ? subject 
    : "Physics") as Subject;
  
  const currentQuestion = questions.find((q) => q.id === activeQuestionId);
  const currentIndex = questions.findIndex((q) => q.id === activeQuestionId);

  // Status for Sidebar
  const sidebarQuestions = useMemo(() => {
    return questions.map((q) => {
      const isSubmitted = submissions[q.id];
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      
      // Calculate status string
      let status: StatusString = "unattempted";
      if (isSubmitted) {
        status = isCorrect ? "correct" : "incorrect";
      }
      
      // Cast to the Interface expected by Sidebar
      return {
        id: q.id,
        number: q.number,
        status: status, 
        section: q.section
      } as SidebarItemStatus; 
    });
  }, [questions, submissions, userAnswers]);


  // --- HANDLERS ---
  const handleOptionSelect = (optId: string) => {
    if (submissions[activeQuestionId]) return;
    setUserAnswers(prev => ({ ...prev, [activeQuestionId]: optId }));
  };

  const handleCheckAnswer = () => {
    if (!userAnswers[activeQuestionId]) return;
    setSubmissions(prev => ({ ...prev, [activeQuestionId]: true }));
  };

  const handleViewSolution = () => {
    setRevealedSolutions(prev => ({ ...prev, [activeQuestionId]: true }));
    setTimeout(() => {
      document.getElementById("detailed-solution-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setActiveQuestionId(questions[currentIndex + 1].id);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setActiveQuestionId(questions[currentIndex - 1].id);
  };

  // Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!currentQuestion) return <div className="p-10 text-white">Loading...</div>;

  const isSubmitted = !!submissions[activeQuestionId];
  const isSolutionVisible = !!revealedSolutions[activeQuestionId];
  const hasSelectedOption = !!userAnswers[activeQuestionId];
  
  let mainStatus: "correct" | "incorrect" | "unattempted" = "unattempted";
  if (isSubmitted) {
    mainStatus = userAnswers[activeQuestionId] === currentQuestion.correctAnswer 
      ? "correct" 
      : "incorrect";
  }

  return (
    <SolutionLayout
      isSidebarOpen={isSidebarOpen}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      header={
        <SolutionHeader
          testName={chapterName}
          activeSubject={safeSubject}
          onBack={() => router.back()}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          mode="practice"
        />
      }
      sidebar={
        <SolutionSidebar
          subjectName={safeSubject}
          questions={sidebarQuestions}
          activeQuestionId={activeQuestionId}
          onQuestionClick={setActiveQuestionId}
          onClose={() => setIsSidebarOpen(false)}
          mode="practice"
        />
      }
      footer={
        <BottomBar
          onNext={handleNext}
          onPrev={handlePrev}
          disablePrev={currentIndex === 0}
          disableNext={currentIndex === questions.length - 1}
        />
      }
    >
      <QuestionMain status={mainStatus}>
        
        <QuestionHeader
          qNumber={currentQuestion.number}
          type={currentQuestion.section}
          marksPos={currentQuestion.meta.marksPos}
          marksNeg={currentQuestion.meta.marksNeg}
        />

        <QuestionText
          content={currentQuestion.text}
          hasImage={currentQuestion.hasImage}
          imageUrl={currentQuestion.imageUrl}
        />

        {currentQuestion.section === "Single Correct" && (
          <OptionsList
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            // Removed 'userAnswer' prop causing error
            selectedOptionId={userAnswers[activeQuestionId]}
            onOptionSelect={handleOptionSelect}
            isSubmitted={isSubmitted}
          />
        )}

        {/* CHECK ANSWER BUTTON */}
        {!isSubmitted && (
          <div style={{ padding: "0 20px 20px 20px" }}>
            <button
              onClick={handleCheckAnswer}
              disabled={!hasSelectedOption}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                background: hasSelectedOption ? "#F59E0B" : "rgba(255,255,255,0.05)",
                color: hasSelectedOption ? "#000" : "rgba(255,255,255,0.3)",
                border: "none",
                fontWeight: 700,
                cursor: hasSelectedOption ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
            >
              Check Answer
            </button>
          </div>
        )}

        {/* VIEW SOLUTION BUTTON */}
        {isSubmitted && !isSolutionVisible && (
          <div style={{ padding: "0 20px 20px 20px" }}>
             <button
              onClick={handleViewSolution}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--dashboard-highlight-color)",
                background: "transparent",
                color: "var(--dashboard-highlight-color)",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <FiEye /> View Detailed Solution
            </button>
          </div>
        )}

        <QuestionMeta chapter={currentQuestion.chapter} topic={currentQuestion.topic} />

        <SolutionContent 
          solutionText={currentQuestion.solution} 
          isVisible={isSolutionVisible} 
        />

        <QuestionStats 
          userTime={currentQuestion.stats.userTime}
          avgTime={currentQuestion.stats.avgTime}
          accuracy={currentQuestion.stats.accuracy}
          isVisible={isSubmitted}
        />

      </QuestionMain>
    </SolutionLayout>
  );
};