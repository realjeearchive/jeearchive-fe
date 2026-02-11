"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// Layout & Structure
import { SolutionLayout } from "@/components/solution-interface/layout/SolutionLayout";
import { SolutionHeader } from "@/components/solution-interface/layout/SolutionHeader";
import { SolutionSidebar } from "@/components/solution-interface/sidebar/SolutionSidebar";

// Question Components
import { QuestionMain } from "@/components/solution-interface/question/QuestionMain/QuestionMain";
import { QuestionHeader } from "@/components/solution-interface/question/QuestionHeader/QuestionHeader";
import { QuestionText } from "@/components/solution-interface/question/QuestionText/QuestionText";
import { OptionsList } from "@/components/solution-interface/question/OptionsList/OptionsList";
import { SolutionContent } from "@/components/solution-interface/question/SolutionContent/SolutionContent";
import { QuestionStats } from "@/components/solution-interface/question/QuestionStats/QuestionStats";

// Navigation
import { BottomBar } from "@/components/solution-interface/navigation/BottomBar";

// --- TYPES & INTERFACES ---
type Subject = "Physics" | "Chemistry" | "Mathematics";
type SectionType = "Single Correct" | "Numerical" | "Multiple Correct";
type Difficulty = "Easy" | "Medium" | "Hard";
type QuestionStatus = "correct" | "incorrect" | "unattempted";

interface Option {
  id: string;
  text: string;
}

interface QuestionStatsData {
  userTime: string;
  avgTime: string;
  accuracy: number;
}

interface QuestionMeta {
  difficulty: Difficulty;
  marksPos: number;
  marksNeg: number;
}

interface QuestionData {
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
  status: QuestionStatus;
  solution: string;
  stats: QuestionStatsData;
  meta: QuestionMeta;
}

interface TestData {
  id: string;
  name: string;
  questions: QuestionData[];
}

// --- DUMMY DATA ---
const TEST_DATA: TestData = {
  id: "test_001",
  name: "JEE Main 2025 (27 Jan Shift 1)",
  questions: [
    // PHYSICS
    {
      id: "q1",
      number: 1,
      subject: "Physics",
      section: "Single Correct",
      text: "<p>A particle is moving in a circle of radius R with constant speed v. The change in velocity in moving from A to B is:</p>",
      hasImage: true,
      imageUrl: "https://via.placeholder.com/600x200/1e1d1b/FFFFFF?text=Diagram+Circle+A+to+B",
      options: [
        { id: "A", text: "2v sin(θ/2)" },
        { id: "B", text: "2v cos(θ/2)" },
        { id: "C", text: "v sin(θ)" },
        { id: "D", text: "v cos(θ)" },
      ],
      correctAnswer: "A",
      userAnswer: "A", // Correct
      status: "correct",
      solution: "<p>Velocity vector changes direction. The magnitude of change is given by vector subtraction formulas...</p>",
      stats: { userTime: "45s", avgTime: "1m 10s", accuracy: 65 },
      meta: { difficulty: "Easy", marksPos: 4, marksNeg: 1 }
    },
    {
      id: "q2",
      number: 2,
      subject: "Physics",
      section: "Single Correct",
      text: "<p>Two blocks of masses m1 and m2 are connected by a massless string...</p>",
      options: [
        { id: "A", text: "5 m/s²" },
        { id: "B", text: "10 m/s²" },
        { id: "C", text: "2.5 m/s²" },
        { id: "D", text: "Zero" },
      ],
      correctAnswer: "B",
      userAnswer: "C", // Wrong
      status: "incorrect",
      solution: "<p>Apply Newton's second law on both blocks separately...</p>",
      stats: { userTime: "2m 10s", avgTime: "1m 45s", accuracy: 42 },
      meta: { difficulty: "Medium", marksPos: 4, marksNeg: 1 }
    },
    {
      id: "q3",
      number: 3,
      subject: "Physics",
      section: "Numerical",
      text: "<p>Find the equivalent resistance between points A and B (in Ohms).</p>",
      options: [],
      correctAnswer: "5",
      userAnswer: null, // Unattempted
      status: "unattempted",
      solution: "<p>Using Wheatstone bridge principle...</p>",
      stats: { userTime: "0s", avgTime: "2m 00s", accuracy: 30 },
      meta: { difficulty: "Hard", marksPos: 4, marksNeg: 0 }
    },

    // CHEMISTRY
    {
      id: "q26",
      number: 1,
      subject: "Chemistry",
      section: "Single Correct",
      text: "<p>Which of the following is diamagnetic?</p>",
      options: [
        { id: "A", text: "O2" },
        { id: "B", text: "N2" },
        { id: "C", text: "O2-" },
        { id: "D", text: "Fe3+" },
      ],
      correctAnswer: "B",
      userAnswer: "B",
      status: "correct",
      solution: "<p>Molecular Orbital Theory configuration for N2 is...</p>",
      stats: { userTime: "20s", avgTime: "45s", accuracy: 88 },
      meta: { difficulty: "Easy", marksPos: 4, marksNeg: 1 }
    },

    // MATHEMATICS
    {
      id: "q51",
      number: 1,
      subject: "Mathematics",
      section: "Single Correct",
      text: "<p>If the function f(x) is continuous at x=0...</p>",
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "2" },
        { id: "C", text: "0" },
        { id: "D", text: "-1" },
      ],
      correctAnswer: "B",
      userAnswer: null,
      status: "unattempted",
      solution: "<p>Evaluate Left Hand Limit and Right Hand Limit...</p>",
      stats: { userTime: "0s", avgTime: "1m 30s", accuracy: 55 },
      meta: { difficulty: "Medium", marksPos: 4, marksNeg: 1 }
    }
  ]
};

// --- MAIN PAGE COMPONENT ---
export default function SolutionPage() {
  const router = useRouter();
  
  // State
  const [activeSubject, setActiveSubject] = useState<Subject>("Physics");
  const [activeQuestionId, setActiveQuestionId] = useState<string>("q1");

  // Filter Questions for Sidebar based on Subject
  const sidebarQuestions = useMemo(() => {
    return TEST_DATA.questions
      .filter((q) => q.subject === activeSubject)
      .map((q) => ({
        id: q.id,
        number: q.number,
        status: q.status,
        section: q.section as "Single Correct" | "Numerical" // Narrowing for sidebar strict type
      }));
  }, [activeSubject]);

  // Get Current Question Data
  const currentQuestion = useMemo(() => {
    return TEST_DATA.questions.find((q) => q.id === activeQuestionId);
  }, [activeQuestionId]);

  // Handlers
  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
    // Auto-jump to first question of that subject
    const firstQ = TEST_DATA.questions.find(q => q.subject === subject);
    if (firstQ) setActiveQuestionId(firstQ.id);
  };

  const handleNext = () => {
    const currentIndex = TEST_DATA.questions.findIndex(q => q.id === activeQuestionId);
    if (currentIndex < TEST_DATA.questions.length - 1) {
      const nextQ = TEST_DATA.questions[currentIndex + 1];
      // Switch subject if needed
      if (nextQ.subject !== activeSubject) {
        setActiveSubject(nextQ.subject);
      }
      setActiveQuestionId(nextQ.id);
    }
  };

  const handlePrev = () => {
    const currentIndex = TEST_DATA.questions.findIndex(q => q.id === activeQuestionId);
    if (currentIndex > 0) {
      const prevQ = TEST_DATA.questions[currentIndex - 1];
      // Switch subject if needed
      if (prevQ.subject !== activeSubject) {
        setActiveSubject(prevQ.subject);
      }
      setActiveQuestionId(prevQ.id);
    }
  };

  // Guard clause if ID invalid
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <SolutionLayout
      header={
        <SolutionHeader 
          testName={TEST_DATA.name}
          activeSubject={activeSubject}
          onSubjectChange={handleSubjectChange}
          onBack={() => router.back()}
        />
      }
      sidebar={
        <SolutionSidebar 
          subjectName={activeSubject}
          questions={sidebarQuestions}
          activeQuestionId={activeQuestionId}
          onQuestionClick={(id) => setActiveQuestionId(id)}
        />
      }
      // NEW: Footer Prop
      footer={
        <BottomBar 
          onNext={handleNext}
          onPrev={handlePrev}
          disablePrev={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === 0}
          disableNext={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === TEST_DATA.questions.length - 1}
        />
      }
    >
      {/* Main Content (Now Scrollable independently) */}
      <QuestionMain 
         status={currentQuestion.status}
         // Add dummy topic/chapter if available in your data
         topic="Adjoint and its Properties"
         chapter="Matrices"
      >
        <QuestionHeader 
          qNumber={currentQuestion.number}
          difficulty={currentQuestion.meta.difficulty}
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
            userAnswer={currentQuestion.userAnswer}
          />
        )}

        {/* ... Numerical Block ... */}

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