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
  logout: () => void;
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

        initFromRefresh: async () => {
          if (get().initialized) return;

          set({ isLoading: true });

          try {
            const data = await refreshTokenRequest(); 
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
