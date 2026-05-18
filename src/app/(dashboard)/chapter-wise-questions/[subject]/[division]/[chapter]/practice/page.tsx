'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchChapterInfo } from "@/features/chapterWise/api";
import { ChapterWiseInterface, QuestionData, Subject } from "@/components/chapterwise/ChapterWiseInterface";
import { chapterConfig } from '@/features/chapterWise/config';

const getSubjectFromSlug = (slug: string): Subject => {
  const s = slug.toLowerCase();
  if (s === "maths" || s === "mathematics") return "Mathematics";
  if (s === "chemistry") return "Chemistry";
  return "Physics";
};

const IMAGE_BASE_URL = "https://jee-mock-test-backend-5bgg.onrender.com/images/"; 

export default function PracticePage() {
  const params = useParams();
  const subject = params.subject as string;
  const division = params.division as string;
  const chapter = params.chapter as string;

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName = divisionChapters.find(c => c.id === chapter)?.title || chapter;

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchChapterInfo(exactChapterName);
        const validSubject = getSubjectFromSlug(subject);

        const mapped: QuestionData[] = data.jeeMain.map((q, index) => {
          const options = [];
          if (q.type === "SingleCorrect" && q.options) {
            if (q.options.optionAtext) options.push({ id: "A", text: q.options.optionAtext });
            if (q.options.optionBtext) options.push({ id: "B", text: q.options.optionBtext });
            if (q.options.optionCtext) options.push({ id: "C", text: q.options.optionCtext });
            if (q.options.optionDtext) options.push({ id: "D", text: q.options.optionDtext });
          }

          // 🔥 THE FIX: Translate backend attempt status into frontend UI status!
          const isCorrect = q.attemptStatus === "Successfully attempted";
          const isIncorrect = q.attemptStatus === "Not successfully done";

          return {
            id: q.id,
            number: index + 1, 
            subject: validSubject,
            section: (q.type === "SingleCorrect" ? "Single Correct" : "Numerical") as "Single Correct" | "Numerical",
            text: q.content,
            hasImage: !!(q.image && q.image.length > 0),
            imageUrl: q.image?.[0] || undefined,
            options,
            correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
            
            // Set the status based on history, but leave userAnswer NULL so the interface knows to fetch it!
            status: isCorrect ? "correct" : isIncorrect ? "incorrect" : "unattempted",
            userAnswer: null, 
            
            // 🔥 YOU MUST ADD THIS LINE HERE!
            isBookmarked: q.isBookmarked || false,
            
            solution: q.solution?.text || "<p>No solution provided.</p>",
            stats: { userTime: "0s", avgTime: "1m 30s", accuracy: 50 },
            meta: { difficulty: "Medium", marksPos: q.positiveMarks || 4, marksNeg: q.negativeMarks || 1 },
            chapter: exactChapterName,
            topic: "Practice",
          };
        });
        
        setQuestions(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [exactChapterName, subject]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[var(--dashboard-background-color,#141312)] text-white">Loading Questions...</div>;

  return (
    <ChapterWiseInterface
      questions={questions}
      chapterName={exactChapterName}
      subject={getSubjectFromSlug(subject)}
    />
  );
}