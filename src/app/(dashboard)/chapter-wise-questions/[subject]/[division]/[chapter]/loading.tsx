import React from 'react';
import { Loader } from "@/components/ui/loader";

export default function ChapterLoading() {
  return (
    <div 
      style={{ backgroundColor: 'var(--dashboard-background-color, #272320)' }} 
      className="flex min-h-screen w-full items-center justify-center"
    >
      <Loader label="Loading..." />
    </div>
  );
}