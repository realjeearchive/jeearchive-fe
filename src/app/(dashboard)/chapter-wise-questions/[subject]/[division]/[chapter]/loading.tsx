import React from 'react';

// 🔥 The "export default" part is what Next.js is looking for!
export default function ChapterLoading() {
  return (
    <div 
      style={{ backgroundColor: 'var(--dashboard-background-color, #272320)' }} 
      className="flex min-h-screen w-full items-center justify-center text-[#B5B4B4]"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#36312F] border-t-[var(--dashboard-core-color, #F59E0B)]"></div>
        <p className="text-sm font-medium tracking-wide">Loading...</p>
      </div>
    </div>
  );
}