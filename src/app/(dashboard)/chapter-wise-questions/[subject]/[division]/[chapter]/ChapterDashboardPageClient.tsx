// src/app/(dashboard)/chapter-wise-questions/[subject]/[division]/[chapter]/ChapterDashboardPageClient.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { fetchChapterInfo, ChapterInfoResponse } from "@/features/chapterWise/api";
import { chapterConfig } from "@/features/chapterWise/config";
import { ChapterDashboard } from "@/components/chapterwise/ChapterDashboard";
import { Loader } from "@/components/ui/loader";
import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";

interface ChapterPageClientProps {
  subject: string;
  division: string;
  chapter: string;
}

export function ChapterDashboardPageClient({
  subject,
  division,
  chapter,
}: ChapterPageClientProps) {
  const { isRateLimited } = useRateLimitStore();

  const [data, setData] = useState<ChapterInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName =
    divisionChapters.find((c) => c.id === chapter)?.title || chapter;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chapterData = await fetchChapterInfo(exactChapterName);
        setData(chapterData);
      } catch (err: unknown) {
        console.error(err);
        const error = err as { status?: number; message?: string };
        if (error?.status === 429 || useRateLimitStore.getState().isRateLimited) {
          // Let the Modal handle it
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [exactChapterName]);

  if (loading && !isRateLimited) {
    return (
      <main
        style={{ backgroundColor: "var(--dashboard-background-color)" }}
        className="flex min-h-screen w-full flex-1 items-center justify-center"
        aria-label="Loading chapter data"
      >
        <Loader label={`Loading ${exactChapterName}...`} />
      </main>
    );
  }

  if ((error || !data) && !isRateLimited) {
    return (
      <main
        style={{ backgroundColor: "var(--dashboard-background-color)" }}
        className="flex min-h-screen w-full flex-1 items-center justify-center text-[#B5B4B4]"
        aria-label="Error loading chapter"
      >
        <p role="alert">Failed to load chapter data. Please try again.</p>
      </main>
    );
  }

  return (
    <>
      <RateLimitModal />

      {data && (
        <main
          className="flex-1 w-full min-h-screen"
          style={{ backgroundColor: "var(--dashboard-background-color)" }}
          aria-label={`${exactChapterName} practice dashboard`}
        >
          {/* BreadcrumbList Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://jeearchive.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Chapter-wise Questions",
                    item: "https://jeearchive.com/chapter-wise-questions",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: exactChapterName,
                    item: `https://jeearchive.com/chapter-wise-questions/${subject}/${division}/${chapter}`,
                  },
                ],
              }),
            }}
          />

          {/* LearningResource Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                name: `${exactChapterName} - JEE Chapter-wise Practice`,
                description: `Practice ${exactChapterName} questions for JEE Main & Advanced with NTA interface`,
                url: `https://jeearchive.com/chapter-wise-questions/${subject}/${division}/${chapter}`,
                educationalLevel: "Higher Secondary",
                about: {
                  "@type": "Thing",
                  name: exactChapterName,
                },
                provider: {
                  "@type": "Organization",
                  name: "JEE Archive",
                  sameAs: "https://jeearchive.com",
                },
              }),
            }}
          />

          <ChapterDashboard
            data={data}
            subject={subject}
            chapterSlug={chapter}
            divisionSlug={division}
            chapterName={exactChapterName}
          />
        </main>
      )}
    </>
  );
}