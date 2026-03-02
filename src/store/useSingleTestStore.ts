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
        set({ data: response.data, isLoading: false });
      } else {
        set({ error: response.message || "Failed to load test analytics", isLoading: false });
      }
    } catch (err: unknown) {
      console.error("Single Test Fetch Error:", err);
      if (err instanceof Error) {
        set({ error: err.message, isLoading: false });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },

  // Useful when unmounting the page so the next test doesn't flash the old test's data
  clearData: () => set({ data: null, isLoading: true, error: null })
}));