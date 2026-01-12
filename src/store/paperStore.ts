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
  getPapers: (year: string) => Promise<void>;
  resetPapers: () => void; // Useful for cleanup when unmounting
}

export const usePaperStore = create<PaperState>()(
  devtools(
    (set) => ({
      papers: [],
      isLoading: false,
      error: null,

      getPapers: async (year) => {
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

          const response = await fetchPapersByYear({ year, accessToken });

          if (response.success) {
            set({ papers: response.data, isLoading: false });
          } else {
            set({ error: response.message, isLoading: false });
          }
        } catch (err) {
          // FIX: Use type narrowing instead of 'any'
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
      name: 'paper-store', // Name for DevTools
    }
  )
);