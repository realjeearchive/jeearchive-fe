// src/store/authStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { refreshTokenRequest } from "@/features/auth/api";
import { jwtDecode } from "jwt-decode";
import type { AccessTokenPayload } from "@/features/auth/types";
import { useUserStore } from "@/store/userStore";

interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  initialized: boolean;
  hasLoggedOut: boolean;

  setAccessToken: (token: string | null) => void;
  setLoading: (value: boolean) => void;
  initFromRefresh: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        isLoading: false,
        initialized: false,
        hasLoggedOut: false,

        setAccessToken: (token) => {
          set({ accessToken: token });

          const setProfile = useUserStore.getState().setProfile;

          if (!token) {
            setProfile(null);
            return;
          }

          try {
            const payload = jwtDecode<AccessTokenPayload>(token);

            setProfile({
              id: payload.id,
              name: payload.name,
              email: payload.email,
            });
          } catch {
            setProfile(null);
          }
        },

        setLoading: (value) => set({ isLoading: value }),

        initFromRefresh: async () => {
          const { initialized, hasLoggedOut } = get();

          if (initialized || hasLoggedOut) return;

          set({ isLoading: true });

          try {
            const data = await refreshTokenRequest();
            get().setAccessToken(data.accessToken);
          } catch {
            get().setAccessToken(null);
          } finally {
            set({ initialized: true, isLoading: false });
          }
        },


        logout: () => {
          const setProfile = useUserStore.getState().setProfile;
          setProfile(null);

          set({
            accessToken: null,
            initialized: true,
          });
        },
      }),
      {
        name: "auth",
      }
    )
  )
);
