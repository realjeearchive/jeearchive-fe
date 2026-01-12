"use client";

import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState { 
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTestPlayerTheme = create<ThemeState>((set, get) => ({
  theme: "light",

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("test-player-theme", theme);
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    localStorage.setItem("test-player-theme", next);
  },
}));
