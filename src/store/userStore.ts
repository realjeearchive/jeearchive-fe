import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  tag?: string;
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
        name: 'user-profile',
      }
    )
  )
);
