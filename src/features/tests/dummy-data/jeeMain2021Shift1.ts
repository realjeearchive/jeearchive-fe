// src/features/tests/dummy-data/jeeMain2021Shift1.ts
import {
  TestDetails,
  Question,
  SectionMarkingScheme,
  TestSummary,
} from "@/features/tests/types";

const summary: TestSummary = {
  id: "jee-main-2021-24-feb-shift-1",
  exam: "JEE_MAIN",
  year: 2021,
  shift: "24 Feb Shift 1",
  title: "JEE Main 2021 (24 Feb Shift 1)",
  totalQuestions: 75,
  durationMinutes: 180,
  totalMarks: 300,
};

const sections: SectionMarkingScheme[] = [
  {
    sectionId: "M_SC",
    name: "Mathematics Single Correct",
    subject: "MATHEMATICS",
    questionCount: 20,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
  {
    sectionId: "M_NUM",
    name: "Mathematics Numerical",
    subject: "MATHEMATICS",
    questionCount: 5,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
  {
    sectionId: "P_SC",
    name: "Physics Single Correct",
    subject: "PHYSICS",
    questionCount: 20,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
  {
    sectionId: "P_NUM",
    name: "Physics Numerical",
    subject: "PHYSICS",
    questionCount: 5,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
  {
    sectionId: "C_SC",
    name: "Chemistry Single Correct",
    subject: "CHEMISTRY",
    questionCount: 20,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
  {
    sectionId: "C_NUM",
    name: "Chemistry Numerical",
    subject: "CHEMISTRY",
    questionCount: 5,
    marksCorrect: 4,
    marksIncorrect: -1,
    marksUnattempted: 0,
  },
];

export const jeeMain2021Shift1Details: TestDetails = {
  summary,
  sections,
  syllabusSummary: "JEE Main full syllabus – Mathematics, Physics, Chemistry.",
  instructions: [
    "Total duration of the paper is 180 minutes.",
    "Each correct answer awards +4 marks. Incorrect answers incur −1 mark, and unattempted questions carry 0 marks.",
    "Use the on‑screen palette to navigate between questions and sections.",
  ],
};

// For now just 6 sample questions – expand later from your paste file
export const jeeMain2021Shift1Questions: Question[] = [
  {
    id: "Q1",
    testId: summary.id,
    questionNumber: 1,
    sectionId: "M_SC",
    subject: "MATHEMATICS",
    type: "SC",
    questionText:
      "The function f(x) = (4x³ − 3x²)/6 − 2sinx + (2x − 1)cosx is:",
    options: [
      { id: "A", text: "increasing in [1/2, ∞)" },
      { id: "B", text: "decreasing in (−∞, 1/2]" },
      { id: "C", text: "decreasing in [1/2, ∞)" },
      { id: "D", text: "increasing in (−∞, 1/2]" },
    ],
    correctOptionId: "A",
    difficulty: "MEDIUM",
    topic: "Differential Calculus",
  },
  {
    id: "Q2",
    testId: summary.id,
    questionNumber: 2,
    sectionId: "M_SC",
    subject: "MATHEMATICS",
    type: "SC",
    questionText:
      "If a₁, a₂, ..., aₙ are in arithmetic progression and Sₙ is their sum, then Sₙ is:",
    options: [
      { id: "A", text: "n(2a₁ + (n − 1)d)/2" },
      { id: "B", text: "n(2aₙ + (n − 1)d)/2" },
      { id: "C", text: "n(a₁ + aₙ)/2" },
      { id: "D", text: "none of these" },
    ],
    correctOptionId: "C",
    difficulty: "EASY",
    topic: "Sequences and Series",
  },
  {
    id: "Q3",
    testId: summary.id,
    questionNumber: 3,
    sectionId: "M_NUM",
    subject: "MATHEMATICS",
    type: "NUM",
    questionText:
      "If the roots of the quadratic equation x² − 5x + k = 0 are equal, then the value of k is:",
    correctNumericAnswer: 25 / 4,
    difficulty: "EASY",
    topic: "Quadratic Equations",
  },
  {
    id: "Q4",
    testId: summary.id,
    questionNumber: 4,
    sectionId: "P_SC",
    subject: "PHYSICS",
    type: "SC",
    questionText:
      "A particle of mass m moves in a circle of radius r with constant speed v. Its centripetal force is:",
    options: [
      { id: "A", text: "mv/r" },
      { id: "B", text: "mv²/r" },
      { id: "C", text: "mr²/v" },
      { id: "D", text: "mv²/r²" },
    ],
    correctOptionId: "B",
    difficulty: "EASY",
    topic: "Circular Motion",
  },
  {
    id: "Q5",
    testId: summary.id,
    questionNumber: 5,
    sectionId: "C_SC",
    subject: "CHEMISTRY",
    type: "SC",
    questionText:
      "Which of the following has the highest electronegativity?",
    options: [
      { id: "A", text: "F" },
      { id: "B", text: "Cl" },
      { id: "C", text: "Br" },
      { id: "D", text: "I" },
    ],
    correctOptionId: "A",
    difficulty: "EASY",
    topic: "Periodic Table",
  },
  {
    id: "Q6",
    testId: summary.id,
    questionNumber: 6,
    sectionId: "P_NUM",
    subject: "PHYSICS",
    type: "NUM",
    questionText:
      "The time period of a simple pendulum is 2 s. Its frequency (in Hz) is:",
    correctNumericAnswer: 0.5,
    difficulty: "EASY",
    topic: "Simple Harmonic Motion",
  },
];
