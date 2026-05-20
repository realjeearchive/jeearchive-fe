"use client";

import { create } from "zustand";
import { fetchSingleTestAnalytics, SingleTestPayload } from "@/features/analytics/singleTestApi";

interface SingleTestStore {
  data: SingleTestPayload | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchData: (testId: string, createdAt: string) => Promise<void>;
  clearData: () => void;
}

export const useSingleTestStore = create<SingleTestStore>((set) => ({
  data: null,
  isLoading: true, // Default to true so the UI shows a loader immediately on mount
  error: null,

  fetchData: async (testId: string, createdAt: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchSingleTestAnalytics(testId, createdAt);
      if (response.success && response.data) {
        console.info(`[Analytics: SingleTest] Successfully loaded details for test: ${testId}`);
        set({ data: response.data, isLoading: false });
      } else {
        set({ error: "Couldn't load your test results. Please try again.", isLoading: false });
      }
    } catch (err: unknown) {
      // Using console.warn to prevent Next.js red-screen crashes during dev
      console.warn("[Analytics: SingleTest] Fetch Error:", err);
      // Short, student-friendly error message
      set({ error: "Connection drop. Please check your internet and refresh.", isLoading: false });
    }
  },

  // Useful when unmounting the page so the next test doesn't flash the old test's data
  clearData: () => set({ data: null, isLoading: true, error: null })
}));