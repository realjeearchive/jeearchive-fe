// src/store/paperStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Paper } from '@/features/tests/types';
import { fetchPapersByYear } from '@/features/tests/api';

interface PaperState {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;

  // Actions
  getPapers: (year: string, examType?: 'JEE_MAIN' | 'JEE_ADVANCED') => Promise<void>;
  resetPapers: () => void; 
}

export const usePaperStore = create<PaperState>()(
  devtools(
    (set) => ({
      papers: [],
      isLoading: false,
      error: null,

      getPapers: async (year, examType = 'JEE_MAIN') => {
        set({ isLoading: true, error: null });

        try {
          // No need to check for token here; api.ts will handle it
          const response = await fetchPapersByYear({ 
            year, 
            accessToken: "", // Wrapper ignores this
            examName: examType 
          });

          if (response.success) {
            set({ papers: response.data, isLoading: false });
          } else {
            set({ error: response.message, isLoading: false });
          }
        } catch (err) {
          let errorMessage = 'Failed to connect to server';

          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }

          set({ error: errorMessage, isLoading: false });
        }
      },

      resetPapers: () => {
        set({ papers: [], error: null, isLoading: false });
      },
    }),
    {
      name: 'paper-store',
    }
  )
);