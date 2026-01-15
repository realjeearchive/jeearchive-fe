// src/store/paperStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Paper } from '@/features/tests/types';
import { fetchPapersByYear } from '@/features/tests/api';
import { useAuthStore } from '@/store/authStore';

interface PaperState {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;

  // Actions
  // UPDATED: Accepts optional examType
  getPapers: (year: string, examType?: 'JEE_MAIN' | 'JEE_ADVANCED') => Promise<void>;
  resetPapers: () => void; 
}

export const usePaperStore = create<PaperState>()(
  devtools(
    (set) => ({
      papers: [],
      isLoading: false,
      error: null,

      // UPDATED Implementation
      getPapers: async (year, examType = 'JEE_MAIN') => {
        set({ isLoading: true, error: null });

        try {
          const accessToken = useAuthStore.getState().accessToken;

          if (!accessToken) {
            set({ 
              isLoading: false, 
              error: 'Authentication required. Please log in.' 
            });
            return;
          }

          // Pass the examType to the API
          const response = await fetchPapersByYear({ 
            year, 
            accessToken, 
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