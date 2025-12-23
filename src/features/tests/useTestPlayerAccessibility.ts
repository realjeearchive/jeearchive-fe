"use client";

import { create } from "zustand";

type FontSize = "small" | "medium" | "large";
type CursorSize = "small" | "medium" | "large";


interface AccessibilityState {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;

  cursorTrailEnabled: boolean;
  toggleCursorTrail: () => void;

  cursorSize: CursorSize;
  setCursorSize: (size: CursorSize) => void;
}

export const useTestPlayerAccessibility = create<AccessibilityState>((set) => ({
  fontSize: "small",

  setFontSize: (fontSize) => set({ fontSize }),

  cursorTrailEnabled: false,
  toggleCursorTrail: () =>
    set((state) => ({
      cursorTrailEnabled: !state.cursorTrailEnabled,
    })),

    cursorSize: "small",
  setCursorSize: (cursorSize) => set({ cursorSize }),
}));
