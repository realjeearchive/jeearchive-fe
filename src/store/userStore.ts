// src/store/userStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        setProfile: (profile) => set({ profile }),
      }),
      {
        name: "user-profile",
      }
    )
  )
);
