"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { get, set } from "idb-keyval";
import { fetchChapterInfo, ChapterInfoResponse, QuestionListItem } from "@/features/chapterWise/api";
import {
  QuestionData,
  Subject,
  SectionType,
} from "@/components/chapterwise/ChapterWiseInterface";
import { chapterConfig } from "@/features/chapterWise/config";
import { sortQuestions } from "@/features/chapterWise/utils";
import { Loader } from "@/components/ui/loader";

const ChapterWiseInterface = dynamic(
  () => import("@/components/chapterwise/ChapterWiseInterface").then((mod) => mod.ChapterWiseInterface),
  { ssr: false } // Client-side only because it relies on window and heavy DOM measurements
);

interface PracticePageClientProps {
  subject: string;
  division: string;
  chapter: string;
}

const getSubjectFromSlug = (slug: string): Subject => {
  const s = slug.toLowerCase();
  if (s === "maths" || s === "mathematics") return "Mathematics";
  if (s === "chemistry") return "Chemistry";
  return "Physics";
};

// 🔥 NEW: Utility to cleanly format slugs into Title Case
const formatSlugToTitle = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function PracticePageClient({
  subject,
  division,
  chapter,
}: PracticePageClientProps) {
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef("");

  const divisionChapters = chapterConfig[division] || [];
  
  // 🔥 FIX: Apply the formatter as the fallback
  const exactChapterName =
    divisionChapters.find((c) => c.id === chapter)?.title || formatSlugToTitle(chapter);

  const examType = searchParams.get("type") || "main";
  const filterYears = searchParams.get("years")?.split(",").map(Number) || [];
  const filterSessions = searchParams.get("sessions")?.split(",") || [];
  const filterDates = searchParams.get("dates")?.split(",") || [];
  const filterShifts = searchParams.get("shifts")?.split(",") || [];

  useEffect(() => {
    let isMounted = true;
    const loadQuestions = async () => {
      const fetchKey = `${chapter}-${examType}-${filterYears.join(",")}-${filterSessions.join(",")}-${filterDates.join(",")}-${filterShifts.join(",")}`;

      if (isFetchingRef.current && lastFetchParamsRef.current === fetchKey) {
        return;
      }

      if (lastFetchParamsRef.current === fetchKey) {
        return;
      }

      isFetchingRef.current = true;
      lastFetchParamsRef.current = fetchKey;

      const processAndSetQuestions = (data: ChapterInfoResponse) => {
        if (!isMounted) return;
        const validSubject = getSubjectFromSlug(subject);
        let sourceQuestions = examType === "advanced" ? data.jeeAdvanced : data.jeeMain;

        const hasFilters =
          filterYears.length > 0 ||
          filterSessions.length > 0 ||
          filterDates.length > 0 ||
          filterShifts.length > 0;

        if (hasFilters) {
          sourceQuestions = sourceQuestions.filter((q: QuestionListItem) => {
            const p = q.papers;
            if (filterYears.length > 0 && (!p?.year || !filterYears.includes(p.year))) return false;
            if (filterSessions.length > 0 && (!p?.session || !filterSessions.includes(p.session))) return false;
            const dateStr = p?.date && p?.month ? `${p.date} ${p.month}` : null;
            if (filterDates.length > 0 && (!dateStr || !filterDates.includes(dateStr))) return false;
            if (filterShifts.length > 0 && (!p?.shift || !filterShifts.includes(p.shift))) return false;
            return true;
          });
        }

        const sortedQuestions = sortQuestions(sourceQuestions);

        const mapped: QuestionData[] = sortedQuestions.map((q: QuestionListItem, index: number) => {
          const options = [];
          if (
            (q.type === "SingleCorrect" || q.type === "MultiCorrect" || q.type === "Comprehension") &&
            q.options
          ) {
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
            correctAnswer: Array.isArray(q.correctAnswer)
              ? q.correctAnswer
              : [q.correctAnswer].filter(Boolean),
            status: (isCorrect ? "correct" : isIncorrect ? "incorrect" : "unattempted") as QuestionData["status"],
            userAnswer: null,
            isBookmarked: q.isBookmarked || false,
            solution: q.solution?.text || "<p>No solution provided.</p>",
            stats: { userTime: "0s", avgTime: "1m 30s", accuracy: 50 },
            meta: {
              difficulty: "Medium",
              marksPos: q.positiveMarks || 4,
              marksNeg: q.negativeMarks || 1,
            },
            chapter: exactChapterName,
            topic: "Practice",
          };
        });
        setQuestions(mapped);
      };

      try {
        let hasCachedData = false;
        const cacheKey = `chapter_info_${chapter}`;
        
        try {
          const cachedData = await get(cacheKey);
          if (cachedData && isMounted) {
            hasCachedData = true;
            processAndSetQuestions(cachedData);
            setLoading(false);
          }
        } catch (e) {
          console.error("IDB get error", e);
        }

        if (!hasCachedData && isMounted) {
          setLoading(true);
        }

        const data = await fetchChapterInfo(chapter);
        
        if (isMounted) {
          try {
            await set(cacheKey, data);
          } catch(e) {
            console.error("IDB set error", e);
          }
          processAndSetQuestions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    loadQuestions();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, examType, filterYears.join(","), filterSessions.join(","), filterDates.join(","), filterShifts.join(",")]);

  if (loading) {
    return (
      <main
        className="flex h-screen items-center justify-center bg-[var(--bg-main)]"
        aria-label="Loading practice questions"
      >
        <Loader label={`Preparing ${exactChapterName} practice...`} />
      </main>
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