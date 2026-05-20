'use client';

import React, { useEffect, useState, use } from 'react';
import { fetchChapterInfo } from "@/features/chapterWise/api";
import { ChapterWiseInterface, QuestionData, Subject, SectionType } from "@/components/chapterwise/ChapterWiseInterface";
import { chapterConfig } from '@/features/chapterWise/config';
import { Loader } from '@/components/ui/loader';

interface PracticePageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

const getSubjectFromSlug = (slug: string): Subject => {
  const s = slug.toLowerCase();
  if (s === "maths" || s === "mathematics") return "Mathematics";
  if (s === "chemistry") return "Chemistry";
  return "Physics";
};

export default function PracticePage(props: PracticePageProps) {
  const { subject, division, chapter } = use(props.params);

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
          if ((q.type === "SingleCorrect" || q.type === "MultiCorrect" || q.type === "Comprehension") && q.options) {
            if (q.options.optionAtext) options.push({ id: "A", text: q.options.optionAtext });
            if (q.options.optionBtext) options.push({ id: "B", text: q.options.optionBtext });
            if (q.options.optionCtext) options.push({ id: "C", text: q.options.optionCtext });
            if (q.options.optionDtext) options.push({ id: "D", text: q.options.optionDtext });
          }

          const isCorrect = q.attemptStatus === "Successfully attempted";
          const isIncorrect = q.attemptStatus === "Not successfully done";

          let sectionType = "Single Correct";
          if (q.type === "Numerical" || q.type === "Integer") sectionType = "Numerical";
          else if (q.type === "MultiCorrect") sectionType = "Multiple Correct";
          else if (q.type === "Comprehension") sectionType = "Comprehension";

          return {
            id: q.id,
            number: index + 1, 
            subject: validSubject,
            section: sectionType as SectionType,
            comprehensionContent: q.comprehensionContent,
            text: q.content,
            hasImage: !!(q.image && q.image.length > 0),
            imageUrl: q.image?.[0] || undefined,
            options,
            correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer].filter(Boolean),
            status: (isCorrect ? "correct" : isIncorrect ? "incorrect" : "unattempted") as QuestionData["status"],
            userAnswer: null, 
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--dashboard-background-color)]">
        <Loader label={`Preparing ${exactChapterName} practice...`} />
      </div>
    );
  }

  return (
    <ChapterWiseInterface
      questions={questions}
      chapterName={exactChapterName}
      subject={getSubjectFromSlug(subject)}
    />
  );
}