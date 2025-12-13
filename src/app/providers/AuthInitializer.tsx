'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initFromRefresh = useAuthStore((s) => s.initFromRefresh);

  useEffect(() => {
    void initFromRefresh();
  }, [initFromRefresh]);

  return <>{children}</>;
}
