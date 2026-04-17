'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchChapterInfo, ChapterInfoResponse } from "@/features/chapterWise/api";
import { chapterConfig } from "@/features/chapterWise/config";
import { ChapterDashboard } from "@/components/chapterwise/ChapterDashboard"; 

export default function ChapterDashboardPage() {
  const params = useParams();
  const subject = params.subject as string;
  const division = params.division as string;
  const chapter = params.chapter as string;

  const [data, setData] = useState<ChapterInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        className="flex min-h-screen w-full flex-1 items-center justify-center text-[#B5B4B4]"
      >
        Loading chapter data...
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
    // 🔥 THE FIX: This wrapper div with "flex-1 w-full" is what removes the white border!
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