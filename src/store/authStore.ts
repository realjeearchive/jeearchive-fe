import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { refreshTokenRequest } from '@/features/auth/api';

interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  initialized: boolean;

  setAccessToken: (token: string | null) => void;
  setLoading: (value: boolean) => void;
  initFromRefresh: () => Promise<void>;
  logout: () => void; // frontend-only, backend clears cookie via expiry
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        isLoading: false,
        initialized: false,

        setAccessToken: (token) => set({ accessToken: token }),

        setLoading: (value) => set({ isLoading: value }),

        // Called once on app mount to convert refreshToken -> accessToken
        initFromRefresh: async () => {
          if (get().initialized) return;

          set({ isLoading: true });

          try {
            const data = await refreshTokenRequest(); // GET /auth/refershToken
            set({
              accessToken: data.accessToken,
              initialized: true,
            });
          } catch {
            set({
              accessToken: null,
              initialized: true,
            });
          } finally {
            set({ isLoading: false });
          }
        },

        logout: () => {
          // There is no /logout route yet; clear frontend state.
          // (Refresh cookie will naturally expire or you can later add /logout.)
          set({ accessToken: null });
        },
      }),
      {
        name: 'auth',
        partialize: (state) => ({ accessToken: state.accessToken }),
      }
    )
  )
);
