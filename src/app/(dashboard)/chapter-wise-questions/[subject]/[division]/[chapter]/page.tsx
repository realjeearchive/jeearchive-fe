'use client';

import React, { useEffect, useState, use } from 'react';
import { fetchChapterInfo, ChapterInfoResponse } from "@/features/chapterWise/api";
import { chapterConfig } from "@/features/chapterWise/config";
import { ChapterDashboard } from "@/components/chapterwise/ChapterDashboard"; 
import { Loader } from '@/components/ui/loader';

interface ChapterPageProps {
  params: Promise<{ subject: string; division: string; chapter: string }>;
}

export default function ChapterDashboardPage(props: ChapterPageProps) {
  // Unwrap the promise-based params for Next.js App Router
  const { subject, division, chapter } = use(props.params);

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
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [exactChapterName]);

  if (loading) {
    return (
      <div 
        style={{ backgroundColor: 'var(--dashboard-background-color)' }} 
        className="flex min-h-screen w-full flex-1 items-center justify-center"
      >
        <Loader label={`Loading ${exactChapterName}...`} />
      </div>
    );
  }

  if (error || !data) {
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
  );
}