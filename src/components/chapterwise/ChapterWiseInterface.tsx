"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { useChapterPracticeStore } from "@/store/useChapterPracticeStore"; 

import { SolutionLayout } from "./layout/SolutionLayout";
import { SolutionHeader } from "./layout/SolutionHeader";
import { SolutionSidebar, QuestionStatus as SidebarItemStatus } from "./sidebar/SolutionSidebar"; 
import { BottomBar } from "./navigation/BottomBar";
import { QuestionMain } from "./question/QuestionMain/QuestionMain";
import { QuestionHeader } from "./question/QuestionHeader/QuestionHeader";
import { QuestionText } from "./question/QuestionText/QuestionText";
import { OptionsList } from "./question/OptionsList/OptionsList";
import { QuestionMeta } from "./question/QuestionMeta/QuestionMeta";
import { SolutionContent } from "./question/SolutionContent/SolutionContent";
import { QuestionStats } from "./question/QuestionStats/QuestionStats";

export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type SectionType = "Single Correct" | "Numerical" | "Multiple Correct";
export type StatusString = "correct" | "incorrect" | "unattempted" | "answered";

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
  subject: Subject | string;
  section: SectionType;
  text: string;
  hasImage?: boolean;
  imageUrl?: string;
  options: Option[];
  correctAnswer: string;
  userAnswer: string | null;
  status: StatusString;
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

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

export const ChapterWiseInterface = ({ 
  questions: rawQuestions, // 🔥 Rename the raw prop
  chapterName, 
  subject 
}: ChapterWiseInterfaceProps) => {
  const router = useRouter();
  
  // 🔥 THE ULTIMATE FIX: Intercept the raw questions and force a strict 1, 2, 3... N sequence.
  // This completely destroys the original JEE exam numbers that cause duplicates and gaps!
  const questions = useMemo(() => {
    return rawQuestions.map((q, index) => ({
      ...q,
      number: index + 1
    }));
  }, [rawQuestions]);

  const {
    activeQuestionId,
    userAnswers,
    submissions,
    revealedSolutions,
    questionTimes,
    initStore,
    setActiveQuestionId,
    selectOption,
    submitAnswer,
    revealSolution,
    incrementTime
  } = useChapterPracticeStore();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const queryQuestionId = params.get('q');
      
      // Initialize the store with our perfectly numbered questions
      initStore(questions, queryQuestionId || undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, initStore]);

  useEffect(() => {
    if (!activeQuestionId || submissions[activeQuestionId]) return;

    const timerId = setInterval(() => {
      incrementTime(activeQuestionId);
    }, 1000);

    return () => clearInterval(timerId);
  }, [activeQuestionId, submissions, incrementTime]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
  const safeSubject = (["Physics", "Chemistry", "Mathematics"].includes(formattedSubject) 
    ? formattedSubject 
    : "Physics") as Subject;
  
  const currentQuestion = questions.find((q) => q.id === activeQuestionId);
  const currentIndex = questions.findIndex((q) => q.id === activeQuestionId);

  const sidebarQuestions = useMemo(() => {
    return questions.map((q) => {
      const isSubmitted = submissions[q.id];
      const userAnswer = userAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      
      let status: StatusString = "unattempted";
      if (isSubmitted) {
        status = isCorrect ? "correct" : "incorrect";
      }
      
      return {
        id: q.id,
        number: q.number, // This is now strictly sequential!
        status: status, 
        section: q.section
      } as SidebarItemStatus; 
    });
  }, [questions, submissions, userAnswers]);

  if (!currentQuestion) return <div className="p-10 text-white">Loading interface...</div>;

  const isSubmitted = !!submissions[activeQuestionId];
  const isSolutionVisible = !!revealedSolutions[activeQuestionId];
  const hasSelectedOption = !!userAnswers[activeQuestionId];
  const currentTimeSpent = questionTimes[activeQuestionId] || 0;
  
  let mainStatus: "correct" | "incorrect" | "unattempted" = "unattempted";
  if (isSubmitted) {
    mainStatus = userAnswers[activeQuestionId] === currentQuestion.correctAnswer 
      ? "correct" 
      : "incorrect";
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setActiveQuestionId(questions[currentIndex + 1].id);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setActiveQuestionId(questions[currentIndex - 1].id);
  };

  const handleViewSolutionClick = () => {
    revealSolution(activeQuestionId);
    setTimeout(() => {
      document.getElementById("detailed-solution-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

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
          timer={formatTime(currentTimeSpent)} 
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
            selectedOptionId={userAnswers[activeQuestionId]}
            onOptionSelect={(optId) => selectOption(activeQuestionId, optId)}
            isSubmitted={isSubmitted}
          />
        )}

        {!isSubmitted && (
          <div style={{ padding: "0 20px 20px 20px" }}>
            <button
              onClick={() => submitAnswer(activeQuestionId)}
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

        {isSubmitted && !isSolutionVisible && (
          <div style={{ padding: "0 20px 20px 20px" }}>
             <button
              onClick={handleViewSolutionClick}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--dashboard-sidebar-border-color)",
                background: "transparent",
                color: "var(--dashboard-secondary-text-color)",
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
          userTime={formatTime(currentTimeSpent)} 
          avgTime={currentQuestion.stats.avgTime}
          accuracy={currentQuestion.stats.accuracy}
          isVisible={isSubmitted}
        />

      </QuestionMain>
    </SolutionLayout>
  );
};