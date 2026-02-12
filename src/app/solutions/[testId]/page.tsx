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
  chapter: string;
  topic: string;
}

interface TestData {
  id: string;
  name: string;
  questions: QuestionData[];
}

// --- EXTENDED DUMMY DATA ---
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
      userAnswer: "A",
      status: "correct",
      chapter: "Kinematics",
      topic: "Circular Motion",
      solution: `
        <div style="font-size: 15px; line-height: 1.8; color: var(--dashboard-secondary-text-color);">
          <p style="margin-bottom: 12px;"><strong style="color: var(--dashboard-primary-text-color);">Step 1: Understand the Vector Difference</strong><br/>
          In uniform circular motion, although the speed remains constant (v), the velocity vector changes direction continuously. To find the change in velocity between two points A and B, we need to subtract the velocity vector at A from the velocity vector at B.</p>
          
          <p style="margin-bottom: 12px;">Let the velocity at A be <strong>v₁</strong> and at B be <strong>v₂</strong>. Since the speed is constant, |v₁| = |v₂| = v.</p>

          <p style="margin-bottom: 12px;"><strong style="color: var(--dashboard-primary-text-color);">Step 2: Vector Subtraction Formula</strong><br/>
          The magnitude of the difference between two vectors a and b with angle θ between them is given by:<br/>
          <em style="color: var(--dashboard-primary-text-color);">|Δv| = √(v₁² + v₂² - 2v₁v₂ cosθ)</em></p>

          <p style="margin-bottom: 12px;"><strong style="color: var(--dashboard-primary-text-color);">Step 3: Substitute Values</strong><br/>
          Substituting v₁ = v and v₂ = v:<br/>
          |Δv| = √(v² + v² - 2(v)(v) cosθ)<br/>
          |Δv| = √(2v² - 2v² cosθ)<br/>
          |Δv| = √(2v² (1 - cosθ))</p>

          <p style="margin-bottom: 12px;"><strong style="color: var(--dashboard-primary-text-color);">Step 4: Trigonometric Identity</strong><br/>
          Using the half-angle formula <em>1 - cosθ = 2 sin²(θ/2)</em>:<br/>
          |Δv| = √(2v² * 2 sin²(θ/2))<br/>
          |Δv| = √(4v² sin²(θ/2))<br/>
          <strong style="color: var(--dashboard-primary-text-color);">|Δv| = 2v sin(θ/2)</strong></p>

          <p>Thus, the magnitude of the change in velocity is <strong>2v sin(θ/2)</strong>. The direction is directed towards the center of the circle for infinitesimally small angles, but generally points inwards.</p>
        </div>
      `,
      stats: { userTime: "45s", avgTime: "1m 10s", accuracy: 65 },
      meta: { difficulty: "Easy", marksPos: 4, marksNeg: 1 }
    },
    {
      id: "q2",
      number: 2,
      subject: "Physics",
      section: "Single Correct",
      text: "<p>Two blocks of masses m1 = 5kg and m2 = 10kg are connected by a massless string passing over a frictionless pulley. What is the acceleration of the system?</p>",
      options: [
        { id: "A", text: "5 m/s²" },
        { id: "B", text: "10 m/s²" },
        { id: "C", text: "3.33 m/s²" },
        { id: "D", text: "Zero" },
      ],
      correctAnswer: "C",
      userAnswer: "A",
      status: "incorrect",
      chapter: "Laws of Motion",
      topic: "Pulley Systems",
      solution: `
        <div style="font-size: 15px; line-height: 1.8; color: var(--dashboard-secondary-text-color);">
          <p style="margin-bottom: 12px;"><strong style="color: var(--dashboard-primary-text-color);">Concept: Newton's Second Law</strong><br/>
          For a system of connected masses, the acceleration 'a' is given by the net pulling force divided by the total mass of the system.</p>
          
          <p style="margin-bottom: 12px;"><strong>Step 1: Draw Free Body Diagrams (FBD)</strong><br/>
          For mass m2 (heavier, moving down):<br/>
          <em>m₂g - T = m₂a</em> ... (i)<br/><br/>
          For mass m1 (lighter, moving up):<br/>
          <em>T - m₁g = m₁a</em> ... (ii)</p>

          <p style="margin-bottom: 12px;"><strong>Step 2: Solve Equations</strong><br/>
          Adding equations (i) and (ii):<br/>
          (m₂g - T) + (T - m₁g) = m₂a + m₁a<br/>
          (m₂ - m₁)g = (m₁ + m₂)a</p>

          <p style="margin-bottom: 12px;"><strong>Step 3: Calculate Acceleration</strong><br/>
          a = [(m₂ - m₁) / (m₁ + m₂)] * g<br/>
          Substituting values (m1=5, m2=10, g=10):<br/>
          a = [(10 - 5) / (5 + 10)] * 10<br/>
          a = [5 / 15] * 10<br/>
          a = (1/3) * 10<br/>
          <strong style="color: var(--dashboard-primary-text-color);">a = 3.33 m/s²</strong></p>

          <p>Therefore, the acceleration of the system is 3.33 m/s². The tension in the string can be calculated by substituting 'a' back into either equation.</p>
        </div>
      `,
      stats: { userTime: "2m 10s", avgTime: "1m 45s", accuracy: 42 },
      meta: { difficulty: "Medium", marksPos: 4, marksNeg: 1 }
    },
    {
      id: "q3",
      number: 3,
      subject: "Physics",
      section: "Numerical",
      text: "<p>Find the equivalent resistance between points A and B if R1=R2=R3=R4=R5=10 Ohms in a balanced Wheatstone bridge configuration.</p>",
      options: [],
      correctAnswer: "10",
      userAnswer: null,
      status: "unattempted",
      chapter: "Current Electricity",
      topic: "Circuits",
      solution: `
        <div style="font-size: 15px; line-height: 1.8; color: var(--dashboard-secondary-text-color);">
          <p style="margin-bottom: 12px;"><strong>Analysis of Circuit:</strong><br/>
          The given circuit represents a Wheatstone bridge. Let the resistors be arranged such that R1 and R2 are in series in one arm, and R3 and R4 in the other, with R5 as the galvanometer arm connecting the midpoints.</p>
          
          <p style="margin-bottom: 12px;"><strong>Condition for Balanced Bridge:</strong><br/>
          A Wheatstone bridge is balanced if the ratio of resistances in opposite arms is equal:<br/>
          <em>R1 / R3 = R2 / R4</em></p>

          <p style="margin-bottom: 12px;">Since all resistors are 10Ω:<br/>
          10/10 = 10/10 => 1 = 1.<br/>
          The bridge is <strong>balanced</strong>.</p>

          <p style="margin-bottom: 12px;"><strong>Result:</strong><br/>
          In a balanced state, no current flows through the central resistor R5. We can effectively remove R5 from the circuit calculations. The circuit simplifies to two parallel branches, each containing two 10Ω resistors in series.</p>

          <p style="margin-bottom: 12px;"><strong>Calculation:</strong><br/>
          Upper branch resistance = R1 + R2 = 10 + 10 = 20Ω<br/>
          Lower branch resistance = R3 + R4 = 10 + 10 = 20Ω<br/>
          Equivalent Resistance (Req):<br/>
          1/Req = 1/20 + 1/20 = 2/20 = 1/10<br/>
          <strong style="color: var(--dashboard-primary-text-color);">Req = 10 Ω</strong></p>
        </div>
      `,
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
      chapter: "Chemical Bonding",
      topic: "Molecular Orbital Theory",
      solution: `
        <div style="font-size: 15px; line-height: 1.8; color: var(--dashboard-secondary-text-color);">
          <p style="margin-bottom: 12px;"><strong>Concept:</strong><br/>
          Diamagnetic species have all paired electrons in their molecular orbitals. Paramagnetic species have at least one unpaired electron.</p>

          <p style="margin-bottom: 12px;"><strong>Analysis via MO Theory:</strong></p>
          
          <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 12px;">
            <li><strong>O2 (16 electrons):</strong> σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px²=π2py² π*2px¹=π*2py¹. It has <strong>2 unpaired electrons</strong> in antibonding orbitals. -> Paramagnetic.</li>
            <li><strong>N2 (14 electrons):</strong> σ1s² σ*1s² σ2s² σ*2s² π2px²=π2py² σ2pz². All electrons are <strong>paired</strong>. -> Diamagnetic.</li>
            <li><strong>O2- (Superoxide, 17 electrons):</strong> Adds one electron to O2's configuration. It will have <strong>1 unpaired electron</strong>. -> Paramagnetic.</li>
            <li><strong>Fe3+ (d5 system):</strong> In high spin complexes (weak field), it has 5 unpaired electrons. -> Paramagnetic.</li>
          </ul>

          <p>Since N2 has no unpaired electrons, it is diamagnetic.</p>
        </div>
      `,
      stats: { userTime: "20s", avgTime: "45s", accuracy: 88 },
      meta: { difficulty: "Easy", marksPos: 4, marksNeg: 1 }
    },

    // MATHEMATICS
    {
      id: "q51",
      number: 1,
      subject: "Mathematics",
      section: "Single Correct",
      text: "<p>If the function f(x) = (sin 2x) / x for x ≠ 0 is continuous at x=0, find f(0).</p>",
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "2" },
        { id: "C", text: "0" },
        { id: "D", text: "-1" },
      ],
      correctAnswer: "B",
      userAnswer: null,
      status: "unattempted",
      chapter: "Limits & Continuity",
      topic: "Continuity",
      solution: `
        <div style="font-size: 15px; line-height: 1.8; color: var(--dashboard-secondary-text-color);">
          <p style="margin-bottom: 12px;"><strong>Condition for Continuity:</strong><br/>
          A function f(x) is continuous at a point x=c if:<br/>
          <em>Limit (x->c) f(x) = f(c)</em></p>

          <p style="margin-bottom: 12px;"><strong>Step 1: Evaluate the Limit</strong><br/>
          We need to find L = Limit (x->0) (sin 2x) / x.</p>
          
          <p style="margin-bottom: 12px;">Using the standard limit property:<br/>
          <em>Limit (θ->0) (sin θ) / θ = 1</em></p>

          <p style="margin-bottom: 12px;">Multiply and divide the expression by 2:<br/>
          L = Limit (x->0) [ (sin 2x) / (2x) ] * 2<br/>
          Let 2x = t. As x->0, t->0.<br/>
          L = 2 * Limit (t->0) (sin t) / t<br/>
          L = 2 * 1 = 2</p>

          <p style="margin-bottom: 12px;"><strong>Step 2: Equate to Function Value</strong><br/>
          For continuity at x=0, f(0) must equal the limit value.<br/>
          Therefore, <strong>f(0) = 2</strong>.</p>
        </div>
      `,
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
      footer={
        <BottomBar 
          onNext={handleNext}
          onPrev={handlePrev}
          disablePrev={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === 0}
          disableNext={TEST_DATA.questions.findIndex(q => q.id === activeQuestionId) === TEST_DATA.questions.length - 1}
        />
      }
    >
      <QuestionMain 
         status={currentQuestion.status}
         topic={currentQuestion.topic}
         chapter={currentQuestion.chapter}
      >
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
            userAnswer={currentQuestion.userAnswer}
          />
        )}

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