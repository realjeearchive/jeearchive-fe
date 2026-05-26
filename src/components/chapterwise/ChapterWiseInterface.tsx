"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChapterPracticeStore } from "@/store/useChapterPracticeStore"; 
import { fetchQuestionAttempts, ChapterAttempt } from "@/features/chapterWise/api";

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
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { NumericalInput } from "./question/NumericalInput/NumericalInput";

export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type SectionType = "Single Correct" | "Numerical" | "Multiple Correct" | "SingleCorrect" | "Integer" | string;
export type StatusString = "correct" | "incorrect" | "unattempted" | "answered";

export interface Option { id: string; text: string; percentage?: number; }
export interface QuestionStatsData { userTime: string; avgTime: string; accuracy: number; }
export interface QuestionMetaData { difficulty: "Easy" | "Medium" | "Hard"; marksPos: number; marksNeg: number; }

export interface QuestionData {
  id: string; number: number; subject: Subject | string; section: SectionType;
  text: string; hasImage?: boolean; imageUrl?: string; options: Option[];
  correctAnswer: string | string[]; 
  comprehensionContent?: string;
  userAnswer: string | null; status: StatusString;
  isBookmarked?: boolean;
  solution: string; stats: QuestionStatsData; meta: QuestionMetaData; chapter: string; topic: string;
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

export const ChapterWiseInterface = ({ questions: rawQuestions, chapterName, subject }: ChapterWiseInterfaceProps) => {
  const router = useRouter();
  
  const questions = useMemo(() => {
    return rawQuestions.map((q, index) => ({ ...q, number: index + 1 }));
  }, [rawQuestions]);

  const {
    activeQuestionId, userAnswers, submissions, questionTimes,
    initStore, setActiveQuestionId, selectOption, submitAnswer, incrementTime, isTimerRunning, toggleTimer,
    bookmarkedQuestions, toggleBookmark 
  } = useChapterPracticeStore();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTab, setActiveTab] = useState<"question" | "solution">("question");
  const [warningMsg, setWarningMsg] = useState("");
  const [scorePopup, setScorePopup] = useState<{ text: string, color: string } | null>(null);
  const [sessionSolved, setSessionSolved] = useState<Record<string, boolean>>({});
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);
  
  const [attemptData, setAttemptData] = useState<ChapterAttempt | null>(null);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(false);

  // Initialize store with questions
  useEffect(() => {
  if (questions && questions.length > 0) {
    const params = new URLSearchParams(window.location.search);
    initStore(questions, params.get('q') || undefined);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [questions, initStore]);

// 🚀 Show timer prompt on EVERY question if timer is not running
useEffect(() => {
  if (!activeQuestionId || activeTab !== "question") return;

  // Use requestAnimationFrame to ensure DOM is ready
  const frameId = requestAnimationFrame(() => {
    const storeState = useChapterPracticeStore.getState();
    
    if (!storeState.isTimerRunning) {
      // Show prompt
      setShowTimerPrompt(true);
      
      // Hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowTimerPrompt(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    } else {
      setShowTimerPrompt(false);
    }
  });

  return () => cancelAnimationFrame(frameId);
}, [activeQuestionId, activeTab, isTimerRunning]);

  useEffect(() => {
    setActiveTab("question");
    setAttemptData(null);
    setWarningMsg("");
  }, [activeQuestionId]);

  useEffect(() => {
  if (!activeQuestionId || activeTab === 'solution' || !isTimerRunning) return; 
  
  const timerId = setInterval(() => incrementTime(activeQuestionId), 1000);
  return () => clearInterval(timerId);
}, [activeQuestionId, activeTab, isTimerRunning, incrementTime]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 1024);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentQuestion = questions.find((q) => q.id === activeQuestionId);
  const currentIndex = questions.findIndex((q) => q.id === activeQuestionId);

  const isSubmitted = !!submissions[activeQuestionId];
  const localUserAnswer = userAnswers[activeQuestionId];

  let mainStatus: StatusString | undefined = undefined;
  
  if (activeTab === 'solution') {
    if (!isSubmitted) {
      mainStatus = "unattempted";
    } else if (localUserAnswer) {
      mainStatus = localUserAnswer === currentQuestion?.correctAnswer ? "correct" : "incorrect";
    } else {
      const status = currentQuestion?.status;
      mainStatus = (status === "correct" || status === "incorrect" || status === "unattempted") 
        ? status 
        : undefined; 
    }
  }

  useEffect(() => {
    if (activeTab === 'solution' && isSubmitted && !localUserAnswer && !attemptData && currentQuestion) {
      const fetchAttempt = async () => {
        setIsLoadingAttempt(true);
        try {
          const res = await fetchQuestionAttempts(currentQuestion.id);
          if (res.chapterAttempts && res.chapterAttempts.length > 0) {
            setAttemptData(res.chapterAttempts[0]);
          }
        } catch (error) {
          console.error("Failed to load historical attempt", error);
        } finally {
          setIsLoadingAttempt(false);
        }
      };
      fetchAttempt();
    }
  }, [activeTab, isSubmitted, localUserAnswer, attemptData, currentQuestion]);

  const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
  const safeSubject = (["Physics", "Chemistry", "Mathematics"].includes(formattedSubject) ? formattedSubject : "Physics") as Subject;

  const sidebarQuestions = useMemo(() => {
    return questions.map((q) => {
      const qIsSubmitted = submissions[q.id];
      const qLocalAnswer = userAnswers[q.id];
      
      let status: StatusString = "unattempted";
      if (qIsSubmitted) {
        status = qLocalAnswer ? (qLocalAnswer === q.correctAnswer ? "correct" : "incorrect") : q.status;
      }
      return { id: q.id, number: q.number, status: status, section: q.section } as SidebarItemStatus; 
    });
  }, [questions, submissions, userAnswers]);

  if (!currentQuestion) return <div className="p-10 text-white">Loading interface...</div>;

  const hasSelectedOption = !!localUserAnswer;
  const currentTimeSpent = questionTimes[activeQuestionId] || 0;

  const actualCorrectAnswer = Array.isArray(currentQuestion?.correctAnswer) 
    ? currentQuestion.correctAnswer[0] 
    : currentQuestion?.correctAnswer;

  const isNumericalType = currentQuestion?.section.toLowerCase().includes("numerical") || currentQuestion?.section.toLowerCase().includes("integer");
  const isMultiType = currentQuestion?.section.toLowerCase().includes("multi");
  const isSingleType = currentQuestion?.section.toLowerCase().includes("single");

  const handleNext = () => currentIndex < questions.length - 1 && setActiveQuestionId(questions[currentIndex + 1].id);
  const handlePrev = () => currentIndex > 0 && setActiveQuestionId(questions[currentIndex - 1].id);

  // Smart warning messages based on question type
  const getWarningMessage = (): string => {
    if (!currentQuestion) return "";
    
    if (isNumericalType) {
      return "Enter a numerical value";
    }
    if (isMultiType) {
      return "Select all correct options";
    }
    return "Select an option to continue";
  };

  const handleCheckAnswer = async () => {
    if (!hasSelectedOption || (Array.isArray(localUserAnswer) && localUserAnswer.length === 0)) {
      setWarningMsg(getWarningMessage());
      setTimeout(() => setWarningMsg(""), 3000); 
      return;
    }
    
    setWarningMsg("");

    if (currentQuestion && actualCorrectAnswer) {
      let isCorrect = false;

      if (isNumericalType) {
        isCorrect = parseFloat(localUserAnswer as string) === parseFloat(actualCorrectAnswer as string);
      } else if (isMultiType) {
        const u = Array.isArray(localUserAnswer) ? localUserAnswer : [localUserAnswer];
        const c = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
        isCorrect = u.length === c.length && u.every(val => c.includes(val as string));
      } else {
        isCorrect = localUserAnswer === actualCorrectAnswer;
      }
        
      setSessionSolved(prev => ({ ...prev, [activeQuestionId]: isCorrect }));

      const marksText = isCorrect ? `+${currentQuestion.meta.marksPos}` : `-${currentQuestion.meta.marksNeg}`;
      const marksColor = isCorrect ? '#22C55E' : '#EF4444'; 
      
      setScorePopup({ text: marksText, color: marksColor });
      setTimeout(() => setScorePopup(null), 1500); 
    }

    await submitAnswer(activeQuestionId);
    setActiveTab("solution");
  };

  const displayUserAnswer = localUserAnswer || attemptData?.userAnswer?.[0];
  
  const isDisplayCorrect = (() => {
    if (!localUserAnswer) {
      return attemptData?.isCorrect ?? (mainStatus === 'correct');
    }

    if (isNumericalType && actualCorrectAnswer) {
      const userStr = Array.isArray(localUserAnswer) ? localUserAnswer[0] : localUserAnswer;
      const correctStr = Array.isArray(actualCorrectAnswer) ? actualCorrectAnswer[0] : actualCorrectAnswer;
      return parseFloat(userStr || "0") === parseFloat(correctStr || "0");
    }

    if (isMultiType) {
      const u = Array.isArray(localUserAnswer) ? localUserAnswer : [localUserAnswer];
      const c = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
      return u.length === c.length && u.every(val => c.includes(val));
    }

    return localUserAnswer === actualCorrectAnswer;
  })();

  const isQuestionSolved = sessionSolved[activeQuestionId] !== undefined 
    ? sessionSolved[activeQuestionId] 
    : currentQuestion?.status === "correct";

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
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isCurrentQuestionSubmitted={isSubmitted}
          timer={formatTime(currentTimeSpent)}
          isTimerRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          marksPos={currentQuestion.meta.marksPos}
          marksNeg={currentQuestion.meta.marksNeg}
          showTools={true}
          isBookmarked={!!bookmarkedQuestions[activeQuestionId]}
          onBookmark={() => toggleBookmark(activeQuestionId)}
          showTimerPrompt={showTimerPrompt}
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
          mainActionText={activeTab === 'question' ? (isSubmitted ? "Update Answer" : "Check Answer") : "Back to Question"}
          onMainAction={activeTab === 'question' ? handleCheckAnswer : () => setActiveTab('question')}
          mainActionDisabled={activeTab === 'question' ? !hasSelectedOption : false}
          warningMessage={warningMsg} 
        />
      }
    >
      <QuestionMain status={mainStatus}>
        
        <QuestionHeader 
          qNumber={currentQuestion.number} 
          type={currentQuestion.section} 
          isSolved={isQuestionSolved} 
        />

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

        <QuestionText content={currentQuestion.text} hasImage={currentQuestion.hasImage} imageUrl={currentQuestion.imageUrl} />

        {activeTab === 'question' && (
          <div className="mt-4">
            {(isSingleType || isMultiType) && (
              <OptionsList 
                options={currentQuestion.options} 
                correctAnswer={currentQuestion.correctAnswer} 
                selectedOptionId={localUserAnswer} 
                onOptionSelect={(optId) => selectOption(activeQuestionId, optId)} 
                isSubmitted={false} 
                isMultiSelect={isMultiType}
              />
            )}

            {isNumericalType && (
              <NumericalInput
                value={(localUserAnswer as string) || ""}
                onChange={(val) => selectOption(activeQuestionId, val)}
                isSubmitted={false}
              />
            )}
          </div>
        )}

        {activeTab === 'solution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
            
            {isLoadingAttempt ? (
               <div style={{ margin: '0 20px', padding: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                 Loading your previous attempt...
               </div>
            ) : displayUserAnswer ? (
               <div style={{ 
                 margin: '10px 20px 0', 
                 display: 'flex', 
                 flexWrap: 'wrap',
                 columnGap: '32px',
                 rowGap: '12px',
                 alignItems: 'center',
                 paddingBottom: '16px',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.08)' 
               }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Answer:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '16px' }}>
                      {isDisplayCorrect ? <FiCheck size={18} strokeWidth={3} color="#22C55E" /> : <FiX size={18} strokeWidth={3} color="#EF4444" />}
                      <span style={{ color: 'var(--dashboard-primary-text-color)' }}>
                        {isNumericalType ? displayUserAnswer : `Option ${displayUserAnswer}`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct Answer:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '16px' }}>
                      <FiCheck size={18} strokeWidth={3} color="#22C55E" />
                      <span style={{ color: 'var(--dashboard-primary-text-color)' }}>
                        {isNumericalType ? actualCorrectAnswer : `Option ${actualCorrectAnswer}`}
                      </span>
                    </div>
                  </div>
               </div>
            ) : null}

            <SolutionContent solutionText={currentQuestion.solution} isVisible={true} />

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
              <QuestionStats userTime={formatTime(currentTimeSpent)} avgTime={currentQuestion.stats.avgTime} accuracy={currentQuestion.stats.accuracy} isVisible={true} />
            </div>

          </div>
        )}

        <QuestionMeta chapter={currentQuestion.chapter} topic={currentQuestion.topic} />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes textFloatSmooth {
            0% { opacity: 0; transform: translate(-50%, 20px) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -10px) scale(1.1); }
            40% { opacity: 1; transform: translate(-50%, -15px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -60px) scale(1); }
          }
        `}} />

        {scorePopup && (
          <div style={{
            position: 'fixed',
            top: '45%', 
            left: '50%',
            zIndex: 9999,
            fontSize: '48px', 
            fontWeight: 800,
            color: scorePopup.color,
            pointerEvents: 'none', 
            textShadow: `0 4px 24px ${scorePopup.color}60, 0 2px 8px rgba(0,0,0,0.5)`,
            animation: 'textFloatSmooth 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            {scorePopup.text}
          </div>
        )}
      </QuestionMain>
    </SolutionLayout>
  );
};