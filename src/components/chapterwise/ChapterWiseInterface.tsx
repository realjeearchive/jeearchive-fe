"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChapterPracticeStore } from "@/store/useChapterPracticeStore";
import { fetchQuestionAttempts, ChapterAttempt, QuestionAttemptsResponse } from "@/features/chapterWise/api";

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
import { FiCheck, FiX } from "react-icons/fi";
import { NumericalInput } from "./question/NumericalInput/NumericalInput";

export type Subject = "Physics" | "Chemistry" | "Mathematics";
export type SectionType =
  | "Single Correct"
  | "Numerical"
  | "Multiple Correct"
  | "SingleCorrect"
  | "Integer"
  | string;
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
  correctAnswer: string | string[];
  comprehensionContent?: string;
  userAnswer: string | null;
  status: StatusString;
  isBookmarked?: boolean;
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
  questions: rawQuestions,
  chapterName,
  subject,
}: ChapterWiseInterfaceProps) => {
  const router = useRouter();

  const questions = useMemo(() => {
    return rawQuestions.map((q, index) => ({ ...q, number: index + 1 }));
  }, [rawQuestions]);

  const {
    activeQuestionId,
    userAnswers,
    submissions,
    questionTimes,
    initStore,
    setActiveQuestionId,
    selectOption,
    submitAnswer,
    incrementTime,
    isTimerRunning,
    toggleTimer,
    bookmarkedQuestions,
    toggleBookmark,
  } = useChapterPracticeStore();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  const [activeTab, setActiveTab] = useState<"question" | "solution" | "history">("question");
  const [warningMsg, setWarningMsg] = useState("");
  const [scorePopup, setScorePopup] = useState<{ text: string; color: string } | null>(null);
  const [sessionSolved, setSessionSolved] = useState<Record<string, boolean>>({});
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);

  const [historyData, setHistoryData] = useState<QuestionAttemptsResponse | null>(null);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const params = new URLSearchParams(window.location.search);
      initStore(questions, params.get("q") || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, initStore]);

  useEffect(() => {
    if (!activeQuestionId || activeTab !== "question") return;

    const frameId = requestAnimationFrame(() => {
      const storeState = useChapterPracticeStore.getState();

      if (!storeState.isTimerRunning) {
        setShowTimerPrompt(true);
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
    setHistoryData(null); 
    setWarningMsg("");
  }, [activeQuestionId]);

  useEffect(() => {
    if (!activeQuestionId || activeTab !== "question" || !isTimerRunning) return;

    const timerId = setInterval(() => incrementTime(activeQuestionId), 1000);
    return () => clearInterval(timerId);
  }, [activeQuestionId, activeTab, isTimerRunning, incrementTime]);

  // 🔥 FIX: Initialize based on width ONCE to avoid destroying the user's manual toggles on incidental resizes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSidebarOpen(window.innerWidth > 1024);
    }
  }, []);

  const currentQuestion = questions.find((q) => q.id === activeQuestionId);
  const currentIndex = questions.findIndex((q) => q.id === activeQuestionId);

  const isSubmitted = !!submissions[activeQuestionId];
  const localUserAnswer = userAnswers[activeQuestionId];

  let mainStatus: StatusString | undefined = undefined;

  if (activeTab === "solution" || activeTab === "history") {
    if (sessionSolved[activeQuestionId] !== undefined) {
      mainStatus = sessionSolved[activeQuestionId] ? "correct" : "incorrect";
    } else if (!isSubmitted) {
      mainStatus = "unattempted";
    } else {
      const status = currentQuestion?.status;
      mainStatus =
        status === "correct" || status === "incorrect" || status === "unattempted"
          ? status
          : undefined;
    }
  }

  useEffect(() => {
    if (
      (activeTab === "solution" || activeTab === "history") &&
      isSubmitted &&
      !historyData &&
      currentQuestion
    ) {
      const fetchAttempt = async () => {
        setIsLoadingAttempt(true);
        try {
          const res = await fetchQuestionAttempts(currentQuestion.id);
          setHistoryData(res);
        } catch (error) {
          console.error("Failed to load historical attempt", error);
        } finally {
          setIsLoadingAttempt(false);
        }
      };
      fetchAttempt();
    }
  }, [activeTab, isSubmitted, historyData, currentQuestion]);

  const formattedSubject =
    subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
  const safeSubject = (
    ["Physics", "Chemistry", "Mathematics"].includes(formattedSubject)
      ? formattedSubject
      : "Physics"
  ) as Subject;

  const sidebarQuestions = useMemo(() => {
    return questions.map((q) => {
      const qIsSubmitted = submissions[q.id];
      let status: "correct" | "unattempted" = "unattempted";

      if (sessionSolved[q.id] !== undefined) {
        status = sessionSolved[q.id] ? "correct" : "unattempted";
      } else if (qIsSubmitted) {
        if (q.status === "correct") {
          status = "correct";
        }
      }

      return {
        id: q.id,
        number: q.number,
        status: status,
        section: q.section as string,
      } as SidebarItemStatus;
    });
  }, [questions, submissions, sessionSolved]);

  if (!currentQuestion)
    return (
      <main className="p-10 text-white" aria-label="Loading practice interface">
        Loading interface...
      </main>
    );

  const hasSelectedOption = !!localUserAnswer;
  const currentTimeSpent = questionTimes[activeQuestionId] || 0;

  const actualCorrectAnswer = Array.isArray(currentQuestion?.correctAnswer)
    ? currentQuestion.correctAnswer[0]
    : currentQuestion?.correctAnswer;

  const isNumericalType =
    currentQuestion?.section.toLowerCase().includes("numerical") ||
    currentQuestion?.section.toLowerCase().includes("integer");
  const isMultiType = currentQuestion?.section.toLowerCase().includes("multi");
  const isSingleType = currentQuestion?.section.toLowerCase().includes("single");

  const handleNext = () =>
    currentIndex < questions.length - 1 &&
    setActiveQuestionId(questions[currentIndex + 1].id);
  const handlePrev = () =>
    currentIndex > 0 && setActiveQuestionId(questions[currentIndex - 1].id);

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
    if (
      !hasSelectedOption ||
      (Array.isArray(localUserAnswer) && localUserAnswer.length === 0)
    ) {
      setWarningMsg(getWarningMessage());
      setTimeout(() => setWarningMsg(""), 3000);
      return;
    }

    setWarningMsg("");

    let isCorrect = false;

    if (currentQuestion && actualCorrectAnswer) {
      if (isNumericalType) {
        isCorrect = parseFloat(localUserAnswer as string) === parseFloat(actualCorrectAnswer as string);
      } else if (isMultiType) {
        const u = Array.isArray(localUserAnswer) ? localUserAnswer : [localUserAnswer as string];
        const c = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer];
        isCorrect = u.length === c.length && u.every((val) => c.includes(val as string));
      } else {
        isCorrect = localUserAnswer === actualCorrectAnswer;
      }

      setSessionSolved((prev) => ({ ...prev, [activeQuestionId]: isCorrect }));

      const marksText = isCorrect ? `+${currentQuestion.meta.marksPos}` : `-${currentQuestion.meta.marksNeg}`;
      const marksColor = isCorrect ? "var(--color-success-main)" : "var(--color-error-main)";

      setScorePopup({ text: marksText, color: marksColor });
      setTimeout(() => setScorePopup(null), 1500);
    }

    if (historyData && currentQuestion) {
      const newAttempt = {
        id: `local-${Date.now()}`, 
        questionId: activeQuestionId,
        studentId: "local-user",
        questionStatus: "answered",
        isCorrect: isCorrect,
        marksObtained: isCorrect ? currentQuestion.meta.marksPos : -currentQuestion.meta.marksNeg,
        timeSpent: questionTimes[activeQuestionId] || 0,
        userAnswer: Array.isArray(localUserAnswer) ? localUserAnswer : [localUserAnswer as string],
        created_at: new Date().toISOString(),
        isAnalyzed: false,
        isPending: false
      };

      setHistoryData(prev => ({
        ...prev!,
        chapterAttempts: [newAttempt, ...(prev?.chapterAttempts || [])]
      }));
    }

    await submitAnswer(activeQuestionId);
    setActiveTab("solution");
  };

  const attemptDataFirst = historyData?.chapterAttempts?.[0];
  const displayUserAnswer = localUserAnswer || attemptDataFirst?.userAnswer?.[0];

  const isDisplayCorrect = (() => {
    if (sessionSolved[activeQuestionId] !== undefined) {
      return sessionSolved[activeQuestionId];
    }

    if (!localUserAnswer) {
      return attemptDataFirst?.isCorrect ?? (mainStatus === "correct");
    }

    if (isNumericalType && actualCorrectAnswer) {
      const userStr = Array.isArray(localUserAnswer)
        ? localUserAnswer[0]
        : localUserAnswer;
      const correctStr = Array.isArray(actualCorrectAnswer)
        ? actualCorrectAnswer[0]
        : actualCorrectAnswer;
      return parseFloat(userStr || "0") === parseFloat(correctStr || "0");
    }

    if (isMultiType) {
      const u = Array.isArray(localUserAnswer)
        ? localUserAnswer
        : [localUserAnswer as string];
      const c = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer
        : [currentQuestion.correctAnswer];
      return (
        u.length === c.length && u.every((val) => c.includes(val as string))
      );
    }

    return localUserAnswer === actualCorrectAnswer;
  })();

  const isQuestionSolved =
    sessionSolved[activeQuestionId] !== undefined
      ? sessionSolved[activeQuestionId]
      : currentQuestion?.status === "correct";

  const renderHistoryList = () => {
    if (isLoadingAttempt) {
      return <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "var(--text-sm)" }}>Loading your history...</div>;
    }
    if (!historyData) return null;

    const allAttempts = [
      ...(historyData.chapterAttempts || []).map((a) => ({ ...a, source: 'Chapter Practice' })),
      ...((historyData.testAttempts as ChapterAttempt[]) || []).map((a) => ({ ...a, source: 'Mock Test' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (allAttempts.length === 0) {
      return <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "var(--text-sm)" }}>No previous attempts found for this question.</div>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {allAttempts.map(attempt => (
          <div key={attempt.id} style={{
            padding: "var(--space-md)", borderRadius: "var(--shape-radius-sm)", border: "1px solid var(--border-divider)",
            backgroundColor: "var(--glass-bg-base)", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                {new Date(attempt.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} • {attempt.source}
              </span>
              <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", marginTop: "var(--space-2xs)" }}>
                <span style={{ fontWeight: 600, color: attempt.isCorrect ? "var(--color-success-main)" : "var(--color-error-main)" }}>
                  {attempt.isCorrect ? "Correct" : "Incorrect"}
                </span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Marks: {attempt.marksObtained}</span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Time: {formatTime(attempt.timeSpent)}</span>
              </div>
            </div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, padding: "var(--space-xs) var(--space-md)", background: "var(--glass-bg-hover)", borderRadius: "var(--shape-radius-sm)", color: "var(--text-primary)" }}>
              Answer: {attempt.userAnswer?.join(", ") || "--"}
            </div>
          </div>
        ))}
      </div>
    );
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
          activeTab={activeTab as "question" | "solution" | "history"}
          onTabChange={setActiveTab}
          isCurrentQuestionSubmitted={sessionSolved[activeQuestionId] !== undefined}
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
          mainActionText={
            activeTab === "question"
              ? isSubmitted
                ? "Check Answer"
                : "Check Answer"
              : "Back to Question"
          }
          onMainAction={
            activeTab === "question"
              ? handleCheckAnswer
              : () => setActiveTab("question")
          }
          mainActionDisabled={
            activeTab === "question" ? !hasSelectedOption : false
          }
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
          <section
            style={{
              background: "color-mix(in srgb, var(--color-focus-ring) 5%, transparent)",
              borderLeft: "4px solid var(--color-focus-ring)",
              padding: "var(--space-md)",
              marginBottom: "var(--space-lg)",
              borderRadius: "0 var(--shape-radius-sm) var(--shape-radius-sm) 0",
            }}
            aria-label="Comprehension passage"
          >
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "bold",
                color: "var(--color-focus-ring)",
                textTransform: "uppercase",
                marginBottom: "var(--space-xs)",
              }}
            >
              Passage
            </div>
            <QuestionText content={currentQuestion.comprehensionContent} />
          </section>
        )}

        <QuestionText
          content={currentQuestion.text}
          hasImage={currentQuestion.hasImage}
          imageUrl={currentQuestion.imageUrl}
        />

        {activeTab === "question" && (
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

        {activeTab === "history" && (
          <section
            style={{
              marginTop: "var(--space-xl)",
              animation: "fadeIn 0.3s ease-out"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
                borderTop: "1px solid var(--border-divider)",
                padding: "var(--space-xl)",
                backgroundColor: "var(--glass-bg-base)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Attempt History
                </span>
              </div>
              <div style={{ color: "var(--text-primary)" }}>
                {renderHistoryList()}
              </div>
            </div>
          </section>
        )}

        {activeTab === "solution" && (
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
              paddingBottom: "var(--space-3xl)",
            }}
            aria-label="Solution and explanation"
          >
            {isLoadingAttempt ? (
              <div
                style={{
                  margin: "0 var(--space-lg)",
                  padding: "var(--space-md)",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "var(--text-sm)",
                }}
                role="status"
                aria-live="polite"
              >
                Loading your previous attempt...
              </div>
            ) : displayUserAnswer ? (
              <div
                style={{
                  margin: "var(--space-sm) var(--space-lg) 0",
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: "var(--space-2xl)",
                  rowGap: "var(--space-sm)",
                  alignItems: "center",
                  paddingBottom: "var(--space-md)",
                  borderBottom: "1px solid var(--glass-border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Your Answer:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-xs)",
                      fontWeight: 700,
                      fontSize: "var(--text-base)",
                    }}
                  >
                    {isDisplayCorrect ? (
                      <FiCheck size={18} strokeWidth={3} color="var(--color-success-main)" aria-hidden="true" />
                    ) : (
                      <FiX size={18} strokeWidth={3} color="var(--color-error-main)" aria-hidden="true" />
                    )}
                    <span style={{ color: "var(--text-primary)" }}>
                      {isNumericalType
                        ? displayUserAnswer
                        : Array.isArray(displayUserAnswer)
                        ? displayUserAnswer.map((opt) => `Option ${opt}`).join(", ")
                        : `Option ${displayUserAnswer}`}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Correct Answer:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-xs)",
                      fontWeight: 700,
                      fontSize: "var(--text-base)",
                    }}
                  >
                    <FiCheck size={18} strokeWidth={3} color="var(--color-success-main)" aria-hidden="true" />
                    <span style={{ color: "var(--text-primary)" }}>
                      {isNumericalType
                        ? actualCorrectAnswer
                        : Array.isArray(currentQuestion.correctAnswer)
                        ? currentQuestion.correctAnswer
                            .map((opt) => `Option ${opt}`)
                            .join(", ")
                        : `Option ${actualCorrectAnswer}`}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <SolutionContent
              solutionText={currentQuestion.solution}
              isVisible={true}
            />

            <div
              style={{
                marginTop: "var(--space-2xl)",
                paddingTop: "var(--space-xl)",
                borderTop: "1px dashed var(--glass-border-strong)",
              }}
            >
            </div>
          </section>
        )}

        <QuestionMeta chapter={currentQuestion.chapter} topic={currentQuestion.topic} />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes textFloatSmooth {
            0% { opacity: 0; transform: translate(-50%, 20px) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -10px) scale(1.1); }
            40% { opacity: 1; transform: translate(-50%, -15px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -60px) scale(1); }
          }
        `,
          }}
        />

        {scorePopup && (
          <div
            style={{
              position: "fixed",
              top: "45%",
              left: "50%",
              zIndex: 9999,
              fontSize: "48px",
              fontWeight: 800,
              color: scorePopup.color,
              pointerEvents: "none",
              textShadow: `0 4px 24px ${scorePopup.color}60, 0 2px 8px rgba(0,0,0,0.5)`,
              animation:
                "textFloatSmooth 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
            role="status"
            aria-live="assertive"
            aria-label={`Score: ${scorePopup.text}`}
          >
            {scorePopup.text}
          </div>
        )}
      </QuestionMain>
    </SolutionLayout>
  );
};