'use client';

import React, { useEffect, useState, use } from 'react';
import { fetchChapterInfo, ChapterInfoResponse } from "@/features/chapterWise/api";
import { chapterConfig } from "@/features/chapterWise/config";
import { ChapterDashboard } from "@/components/chapterwise/ChapterDashboard"; 
import { Loader } from '@/components/ui/loader';

// 🚨 NEW: Import Rate Limit Store and Modal
import { RateLimitModal } from '@/components/ui/RateLimitModal/RateLimitModal';
import { useRateLimitStore } from '@/store/useRateLimitStore';

interface ChapterPageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

export default function ChapterDashboardPage(props: ChapterPageProps) {
  // Unwrap the promise-based params for Next.js App Router
  const { subject, division, chapter } = use(props.params);

  // 🚨 NEW: Listen to global rate limit state
  const { isRateLimited } = useRateLimitStore();

  const [data, setData] = useState<ChapterInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Derive the exact chapter title from your config
  const divisionChapters = chapterConfig[division] || [];
  const exactChapterName = divisionChapters.find(c => c.id === chapter)?.title || chapter;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const chapterData = await fetchChapterInfo(exactChapterName);
        setData(chapterData);
      } catch (err: unknown) {
        console.error(err);
        
        // 🚨 FIX: Explicitly check if the error is a 429 OR if the store is already active
        // If it is rate limited, we do NOT set the generic error state.
        const error = err as { status?: number; message?: string };
        if (error?.status === 429 || useRateLimitStore.getState().isRateLimited) {
          // Do nothing. Let the Modal handle it.
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [exactChapterName]);

  // 🚨 FIX: Only show the loader if we are NOT rate limited
  if (loading && !isRateLimited) {
    return (
      <div 
        style={{ backgroundColor: 'var(--dashboard-background-color)' }} 
        className="flex min-h-screen w-full flex-1 items-center justify-center"
      >
        <Loader label={`Loading ${exactChapterName}...`} />
      </div>
    );
  }

  // 🚨 FIX: Only show the generic error if we are NOT rate limited
  if ((error || !data) && !isRateLimited) {
    return (
      <div 
        style={{ backgroundColor: 'var(--dashboard-background-color)' }} 
        className="flex min-h-screen w-full flex-1 items-center justify-center text-[#B5B4B4]"
      >
        Failed to load chapter data. Please try again.
      </div>
    );
  }

  return (
    <>
      {/* 🚨 THE RATE LIMIT MODAL - Mounts globally over everything if triggered */}
      <RateLimitModal />

      {/* Render the dashboard only if we have data or if the modal is currently covering the screen */}
      {data && (
        <div 
          className="flex-1 w-full min-h-screen" 
          style={{ backgroundColor: 'var(--dashboard-background-color)' }}
        >
          <ChapterDashboard 
            data={data}
            subject={subject}
            chapterSlug={chapter}
            divisionSlug={division}
            chapterName={exactChapterName}
          />
        </div>
      )}
    </>
  );
}