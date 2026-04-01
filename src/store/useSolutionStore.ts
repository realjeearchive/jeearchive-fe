"use client";

import { create } from "zustand";
import { SolutionDataPayload } from "@/features/solutions/solutionsApi";

interface SolutionStore {
  rawSolutionData: SolutionDataPayload | null;
  isLoading: boolean;
  error: string | null;
  
  fetchData: (paperId: string) => Promise<void>;
  clearData: () => void;
}

export const useSolutionStore = create<SolutionStore>((set) => ({
  rawSolutionData: null,
  isLoading: true, // Start in loading state so UI doesn't flash empty
  error: null,

  fetchData: async (paperId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Dynamic import prevents circular dependency issues during SSR
      const { fetchTestSolutionData } = await import("@/features/solutions/solutionsApi");
      const res = await fetchTestSolutionData(paperId);
      
      if (res.success && res.data) {
        set({ rawSolutionData: res.data, isLoading: false });
      } else {
        set({ error: "Failed to load solution data", isLoading: false });
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            set({ error: err.message, isLoading: false });
        } else {
            set({ error: "An unexpected error occurred while fetching solutions.", isLoading: false });
        }
    }
  },

  clearData: () => set({ rawSolutionData: null, isLoading: true, error: null })
}));