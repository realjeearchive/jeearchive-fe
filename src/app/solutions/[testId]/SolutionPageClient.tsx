"use client";


import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SolutionLayout } from "@/components/solution-interface/layout/SolutionLayout";
import { SolutionHeader } from "@/components/solution-interface/layout/SolutionHeader";
import { SolutionSidebar } from "@/components/solution-interface/sidebar/SolutionSidebar";
import { QuestionMain } from "@/components/solution-interface/question/QuestionMain/QuestionMain";
import { QuestionHeader } from "@/components/solution-interface/question/QuestionHeader/QuestionHeader";
import { QuestionText } from "@/components/solution-interface/question/QuestionText/QuestionText";
import { OptionsList } from "@/components/solution-interface/question/OptionsList/OptionsList";
import { SolutionContent } from "@/components/solution-interface/question/SolutionContent/SolutionContent";
import { QuestionStats } from "@/components/solution-interface/question/QuestionStats/QuestionStats";
import { QuestionMeta } from "@/components/solution-interface/question/QuestionMeta/QuestionMeta";
import { Loader } from "@/components/ui/loader";
import { BottomBar } from "@/components/solution-interface/navigation/BottomBar";

import { useSolutionStore } from "@/store/useSolutionStore";
import {
  transformSolutionData,
  Subject,
} from "@/features/solutions/solutionsTransformer";

interface SolutionPageClientProps {
  testId: string;
}

export function SolutionPageClient({ testId }: SolutionPageClientProps) {
  const router = useRouter();

  const { rawSolutionData, isLoading, error, fetchData, clearData } =
    useSolutionStore();
  const TEST_DATA = useMemo(
    () => transformSolutionData(rawSolutionData),
    [rawSolutionData]
  );

  const [activeSubject, setActiveSubject] = useState<Subject>("Physics");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (testId) fetchData(testId);
    return () => clearData();
  }, [testId, fetchData, clearData]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarQuestions = useMemo(() => {
    if (!TEST_DATA) return [];
    return TEST_DATA.questions
      .filter((q) => q.subject === activeSubject)
      .map((q) => ({
        id: q.id,
        number: q.number,
        status: q.status,
        section: q.section,
      }));
  }, [TEST_DATA, activeSubject]);

  const activeQuestionId: string = useMemo(() => {
    if (!TEST_DATA || sidebarQuestions.length === 0) return "";
    const isSelectedValid = sidebarQuestions.some(
      (q) => q.id === selectedQuestionId
    );
    if (isSelectedValid && selectedQuestionId) {
      return selectedQuestionId;
    }
    return sidebarQuestions[0].id;
  }, [sidebarQuestions, selectedQuestionId, TEST_DATA]);

  const currentQuestion = useMemo(() => {
    if (!TEST_DATA || !activeQuestionId) return null;
    return TEST_DATA.questions.find((q) => q.id === activeQuestionId);
  }, [TEST_DATA, activeQuestionId]);

  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
  };

  const handleNext = () => {
    if (!TEST_DATA || !activeQuestionId) return;
    const currentIndex = TEST_DATA.questions.findIndex(
      (q) => q.id === activeQuestionId
    );
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
    const currentIndex = TEST_DATA.questions.findIndex(
      (q) => q.id === activeQuestionId
    );
    if (currentIndex > 0) {
      const prevQ = TEST_DATA.questions[currentIndex - 1];
      if (prevQ.subject !== activeSubject) {
        setActiveSubject(prevQ.subject);
      }
      setSelectedQuestionId(prevQ.id);
    }
  };

  if (isLoading) {
    return (
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)]"
        aria-label="Loading solutions"
      >
        <Loader label="Loading detailed solutions..." />
      </main>
    );
  }

  if (error || !TEST_DATA || !currentQuestion) {
    return (
      <main
        className="flex flex-col items-center justify-center min-h-screen text-[var(--color-error-main)] bg-[var(--bg-main)] gap-4"
        aria-label="Solutions error"
      >
        <p className="text-sm font-medium" role="alert">
          {error || "Solution data not available."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] text-sm font-medium rounded-md hover:bg-[var(--color-brand-primary)] hover:text-black transition-colors duration-200"
          aria-label="Go back"
        >
          Go Back
        </button>
      </main>
    );
  }

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
          activeQuestionId={activeQuestionId}
          onQuestionClick={(id) => {
            setSelectedQuestionId(id);
            if (window.innerWidth <= 1024) setIsSidebarOpen(false);
          }}
          onClose={() => setIsSidebarOpen(false)}
        />
      }
      footer={
        <BottomBar
          onNext={handleNext}
          onPrev={handlePrev}
          disablePrev={
            TEST_DATA.questions.findIndex((q) => q.id === activeQuestionId) === 0
          }
          disableNext={
            TEST_DATA.questions.findIndex((q) => q.id === activeQuestionId) ===
            TEST_DATA.questions.length - 1
          }
        />
      }
    >
      <QuestionMain status={currentQuestion.status}>
        <QuestionHeader
          qNumber={
            sidebarQuestions.findIndex((q) => q.id === currentQuestion.id) + 1
          }
          type={currentQuestion.section}
          marksPos={currentQuestion.meta.marksPos}
          marksNeg={currentQuestion.meta.marksNeg}
        />

        {currentQuestion.comprehensionContent && (
          <section
            style={{
              background: "color-mix(in srgb, var(--color-focus-ring) 5%, transparent)",
              borderLeft: "4px solid var(--color-focus-ring)",
              padding: "16px",
              marginBottom: "20px",
              borderRadius: "0 8px 8px 0",
            }}
            aria-label="Comprehension passage"
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "var(--color-focus-ring)",
                textTransform: "uppercase",
                marginBottom: "8px",
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

        {currentQuestion.section.includes("Correct") ? (
          <OptionsList
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            userAnswer={currentQuestion.userAnswer}
          />
        ) : (
          <div className="mb-6 p-5 rounded-lg border border-[var(--border-divider)] bg-[var(--glass-bg-base)]">
            <div className="flex flex-col gap-3">
              {currentQuestion.userAnswer &&
              currentQuestion.userAnswer.length > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                    Your Answer:
                  </span>
                  <span
                    className={`text-lg font-bold ${currentQuestion.status === "correct" ? "text-[var(--color-success-main)]" : "text-[var(--color-error-main)]"}`}
                  >
                    {currentQuestion.userAnswer.join(", ")}
                  </span>
                </div>
              ) : (
                <div className="text-[13px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                  Status: <span className="opacity-60">Unattempted</span>
                </div>
              )}

              <div className="w-full h-[1px] bg-[var(--border-divider)] my-1"></div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                  Correct Answer:
                </span>
                <span className="text-lg font-bold text-[var(--color-success-main)]">
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

        <SolutionContent solutionText={currentQuestion.solution} />
      </QuestionMain>
    </SolutionLayout>
  );
}