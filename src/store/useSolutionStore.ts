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
      const { fetchTestSolutionData } = await import("@/features/solutions/solutionsApi");
      const res = await fetchTestSolutionData(paperId);
      
      if (res.success && res.data) {
        console.info(`[Solutions] Successfully loaded solution data.`);
        set({ rawSolutionData: res.data, isLoading: false });
      } else {
        set({ error: "Failed to load solution data. Please try again.", isLoading: false });
      }
    } catch (err: unknown) {
      // 🔥 FIXED: Prevent dev crashes and use student-friendly errors
      console.warn("[Solutions] Data fetch failed:", err);
      set({ error: "Connection drop. Please check your internet and refresh.", isLoading: false });
    }
  },

  clearData: () => set({ rawSolutionData: null, isLoading: true, error: null })
}));