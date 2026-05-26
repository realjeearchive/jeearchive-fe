"use client";

import { create } from "zustand";

interface RateLimitStore {
  isRateLimited: boolean;
  setRateLimited: (status: boolean) => void;
}

export const useRateLimitStore = create<RateLimitStore>((set) => ({
  isRateLimited: false,
  setRateLimited: (status) => set({ isRateLimited: status }),
}));