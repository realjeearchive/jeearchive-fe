"use client";

import { create } from "zustand";
import { fetchStreakData, StreakData } from "@/features/streak/api";

interface StreakStore {
  streak: StreakData | null;
  isLoading: boolean;
  error: string | null;
  loadStreak: () => Promise<void>;
}

export const useStreakStore = create<StreakStore>((set) => ({
  streak: null,
  isLoading: false,
  error: null,

  loadStreak: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchStreakData();
      if (response.success && response.data) {
        set({ streak: response.data, isLoading: false });
      } else {
        set({ error: "Failed to load streak", isLoading: false });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, isLoading: false });
    }
  },
}));