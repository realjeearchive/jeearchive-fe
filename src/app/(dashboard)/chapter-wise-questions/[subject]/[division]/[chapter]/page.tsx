import React from "react";
import { ChapterWiseInterface, QuestionData, Subject } from "@/components/chapterwise/ChapterWiseInterface";

interface PageProps {
  params: Promise<{
    subject: string;
    division: string;
    chapter: string;
  }>;
}

// --- HELPER: CONVERT URL SLUG TO PROPER SUBJECT NAME ---
const getSubjectFromSlug = (slug: string): Subject => {
  const s = slug.toLowerCase();
  if (s === "maths" || s === "mathematics") return "Mathematics";
  if (s === "chemistry") return "Chemistry";
  if (s === "physics") return "Physics";
  return "Physics"; // Default fallback
};

// --- DUMMY DATA GENERATOR ---
const generateChapterQuestions = (chapterName: string, subjectSlug: string): QuestionData[] => {
  // 1. Get the proper Subject Type
  const validSubject = getSubjectFromSlug(subjectSlug);

  return Array.from({ length: 15 }).map((_, i) => ({
    id: `q-${i + 1}`,
    number: i + 1,
    subject: validSubject, // Use the corrected subject here
    section: i < 10 ? "Single Correct" : "Numerical", 
    text: `<p>Sample question ${i + 1} for <strong>${chapterName}</strong>...</p>`,
    hasImage: i % 5 === 0,
    imageUrl: i % 5 === 0 ? "https://via.placeholder.com/600x200" : undefined,
    options: i < 10 ? [
      { id: "A", text: "Option A", percentage: 45 },
      { id: "B", text: "Option B", percentage: 25 },
      { id: "C", text: "Option C", percentage: 15 },
      { id: "D", text: "Option D", percentage: 15 },
    ] : [],
    correctAnswer: "A",
    userAnswer: null,
    status: "unattempted",
    solution: `<p>Detailed solution for ${chapterName}...</p>`,
    stats: {
      userTime: "0s",
      avgTime: "1m 20s",
      accuracy: 60,
    },
    meta: {
      difficulty: "Medium",
      marksPos: 4,
      marksNeg: 1,
    },
    chapter: chapterName,
    topic: "General Topic",
  }));
};

export default async function ChapterPage(props: PageProps) {
  const { chapter, subject } = await props.params;

  // 1. Format Chapter Name (e.g., "sets-relations" -> "Sets Relations")
  const formattedChapter = chapter
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // 2. Generate Data using the raw subject slug
  const mockQuestions = generateChapterQuestions(formattedChapter, subject);

  // 3. Pass the CORRECTED subject string to the Interface
  const finalSubjectName = getSubjectFromSlug(subject);

  return (
    <ChapterWiseInterface
      questions={mockQuestions}
      chapterName={formattedChapter}
      subject={finalSubjectName} // <--- Passing "Mathematics", not "maths"
    />
  );
}