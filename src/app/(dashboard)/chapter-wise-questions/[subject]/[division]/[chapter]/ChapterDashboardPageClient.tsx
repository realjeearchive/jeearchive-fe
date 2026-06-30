"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchChapterInfo, ChapterInfoResponse } from "@/features/chapterWise/api";
import { chapterConfig } from "@/features/chapterWise/config";
import { Loader } from "@/components/ui/loader";

const ChapterDashboard = dynamic(
  () => import("@/components/chapterwise/ChapterDashboard").then((mod) => mod.ChapterDashboard),
  { ssr: false } // Avoids hydration issues with heavy dashboard charts
);
import { RateLimitModal } from "@/components/ui/RateLimitModal/RateLimitModal";
import { useRateLimitStore } from "@/store/useRateLimitStore";

interface ChapterPageClientProps {
  subject: string;
  division: string;
  chapter: string;
}

import { get, set } from "idb-keyval";

// 🔥 NEW: Utility to cleanly format slugs into Title Case just in case
const formatSlugToTitle = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

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
  
  // 🔥 FIX: Apply the formatter as the fallback instead of the raw slug
  const exactChapterName =
    divisionChapters.find((c) => c.id === chapter)?.title || formatSlugToTitle(chapter);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      let hasCachedData = false;
      const cacheKey = `chapter_info_${chapter}`;
      
      try {
        // 1. Try to load from IndexedDB first
        const cachedData = await get(cacheKey);
        if (cachedData && isMounted) {
          hasCachedData = true;
          setData(cachedData);
          setLoading(false); // Hide loader if we have cache
        }
      } catch (e) {
        console.error("IDB get error", e);
      }

      if (!hasCachedData && isMounted) {
        setLoading(true);
      }

      // 2. Fetch fresh data from API
      try {
        const chapterData = await fetchChapterInfo(chapter);
        
        if (isMounted) {
          setData(chapterData);
          // Save fresh data to IndexedDB
          try {
            await set(cacheKey, chapterData);
          } catch (e) {
            console.error("IDB set error", e);
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        console.error(err);
        const errObj = err as { status?: number; message?: string };
        if (errObj?.status === 429 || useRateLimitStore.getState().isRateLimited) {
          // Let the Modal handle it
        } else if (!hasCachedData) {
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [chapter]);

  if (loading && !isRateLimited) {
    return (
      <main
        style={{ backgroundColor: "var(--bg-main)" }}
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
        style={{ backgroundColor: "var(--bg-main)" }}
        className="flex min-h-screen w-full flex-1 items-center justify-center text-[var(--text-secondary)]"
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
          style={{ backgroundColor: "var(--bg-main)" }}
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