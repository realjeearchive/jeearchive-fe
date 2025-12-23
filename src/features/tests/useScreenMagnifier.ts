"use client";
import { create } from "zustand";

interface ScreenMagnifierState {
  enabled: boolean;
  toggle: () => void;
}

export const useScreenMagnifier = create<ScreenMagnifierState>((set) => ({
  enabled: false,
  toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
