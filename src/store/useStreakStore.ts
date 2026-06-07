"use client";

import { create } from "zustand";
import { fetchStreakData, StreakData } from "@/features/streak/api";

interface StreakStore {
  streak: StreakData | null;
  isLoading: boolean;
  error: string | null;
  isPopupOpen: boolean;
  loadStreak: () => Promise<void>;
  setPopupOpen: (isOpen: boolean) => void;
}

export const useStreakStore = create<StreakStore>((set) => ({
  streak: null,
  isLoading: false,
  error: null,
  isPopupOpen: false,

  loadStreak: async () => {
    try {
      const response = await fetchStreakData();
      if (response.success && response.data) {
        set({ streak: response.data, isLoading: false, error: null });
      } else {
        set({ error: "Failed to load streak", isLoading: false });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      set({ error: errorMessage, isLoading: false });
    }
  },

  setPopupOpen: (isOpen) => set({ isPopupOpen: isOpen }),
}));