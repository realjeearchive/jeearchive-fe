import React from "react";
// Import the 'Subject' type along with the interface
import { ChapterWiseInterface, QuestionData, Subject } from "@/components/chapterwise/ChapterWiseInterface";

interface PageProps {
  params: Promise<{
    subject: string;
    division: string;
    chapter: string;
  }>;
}

// --- DUMMY DATA GENERATOR ---
const generateChapterQuestions = (chapterName: string, subject: string): QuestionData[] => {
  // 1. Capitalize the subject string
  const formattedSubjectString = subject.charAt(0).toUpperCase() + subject.slice(1);

  // 2. Validate and Cast: Ensure it is one of the allowed types, default to Physics if unknown
  const validSubject: Subject = ["Physics", "Chemistry", "Mathematics"].includes(formattedSubjectString)
    ? (formattedSubjectString as Subject)
    : "Physics";

  return Array.from({ length: 15 }).map((_, i) => ({
    id: `q-${i + 1}`,
    number: i + 1,
    
    // FIX: Use the typed variable instead of 'as any'
    subject: validSubject, 
    
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

  const formattedChapter = chapter
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const mockQuestions = generateChapterQuestions(formattedChapter, subject);

  return (
    <ChapterWiseInterface
      questions={mockQuestions}
      chapterName={formattedChapter}
      subject={subject}
    />
  );
}