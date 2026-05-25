'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 FIX 1: Use ref to prevent double API calls
  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<string>('');

  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName = divisionChapters.find(c => c.id === chapter)?.title || chapter;

  // Extract filter params from URL
  const examType = searchParams.get('type') || 'main'; // 'main' or 'advanced'
  const filterYears = searchParams.get('years')?.split(',').map(Number) || [];
  const filterSessions = searchParams.get('sessions')?.split(',') || [];
  const filterDates = searchParams.get('dates')?.split(',') || [];
  const filterShifts = searchParams.get('shifts')?.split(',') || [];

  useEffect(() => {
    const loadQuestions = async () => {
      // 🔥 FIX 2: Create a unique key for this fetch to prevent duplicates
      const fetchKey = `${exactChapterName}-${examType}-${filterYears.join(',')}-${filterSessions.join(',')}-${filterDates.join(',')}-${filterShifts.join(',')}`;
      
      // Skip if already fetching with same params
      if (isFetchingRef.current && lastFetchParamsRef.current === fetchKey) {
        console.log('[PracticePage] Skipping duplicate fetch with same params');
        return;
      }
      
      // Skip if params haven't changed
      if (lastFetchParamsRef.current === fetchKey) {
        console.log('[PracticePage] Params unchanged, skipping fetch');
        return;
      }
      
      isFetchingRef.current = true;
      lastFetchParamsRef.current = fetchKey;
      
      try {
        setLoading(true);
        const data = await fetchChapterInfo(exactChapterName);
        const validSubject = getSubjectFromSlug(subject);

        // 🔥 FIX 3: Use the correct question set based on exam type
        let sourceQuestions = examType === 'advanced' ? data.jeeAdvanced : data.jeeMain;
        
        // Apply filters if they exist
        const hasFilters = filterYears.length > 0 || filterSessions.length > 0 || 
                          filterDates.length > 0 || filterShifts.length > 0;

        if (hasFilters) {
          sourceQuestions = sourceQuestions.filter(q => {
            const p = q.papers;
            
            // Year filter
            if (filterYears.length > 0 && (!p?.year || !filterYears.includes(p.year))) {
              return false;
            }
            
            // Session filter
            if (filterSessions.length > 0 && (!p?.session || !filterSessions.includes(p.session))) {
              return false;
            }
            
            // Date filter
            const dateStr = p?.date && p?.month ? `${p.date} ${p.month}` : null;
            if (filterDates.length > 0 && (!dateStr || !filterDates.includes(dateStr))) {
              return false;
            }
            
            // Shift filter
            if (filterShifts.length > 0 && (!p?.shift || !filterShifts.includes(p.shift))) {
              return false;
            }
            
            return true;
          });
        }

        // Sort by question number first, then renumber sequentially
        sourceQuestions.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));

        const mapped: QuestionData[] = sourceQuestions.map((q, index) => {
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
        isFetchingRef.current = false;
      }
    };
    
    loadQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exactChapterName, examType, filterYears.join(','), filterSessions.join(','), filterDates.join(','), filterShifts.join(',')]);

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