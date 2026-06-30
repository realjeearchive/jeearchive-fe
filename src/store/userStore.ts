// src/store/userStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { 
  getStudentProfileRequest, 
  getStageNumberRequest, 
  type StudentProfile 
} from "@/features/users/api";

interface UserState {
  profile: Partial<StudentProfile> | null;
  stageNumber: number | null;
  isLoadingProfile: boolean;

  // Actions
  setProfile: (profile: Partial<StudentProfile> | null) => void;
  setStageNumber: (stage: number) => void;
  
  // Async Actions
  fetchProfile: (force?: boolean) => Promise<void>;
  syncStageNumber: () => Promise<number | null>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        stageNumber: null,
        isLoadingProfile: false,

        // Gracefully handles partial updates (like from JWT decoding in authStore)
        setProfile: (partialProfile) => {
          if (!partialProfile) {
            get().clearUser();
            return;
          }
          set((state) => {
            const updatedProfile = state.profile 
              ? { ...state.profile, ...partialProfile } 
              : partialProfile;
              
            return {
              profile: updatedProfile,
              // Keep stageNumber directly accessible at the top level for easy routing checks
              stageNumber: partialProfile.stageNumber !== undefined 
                ? partialProfile.stageNumber 
                : state.stageNumber,
            };
          });
        },

        setStageNumber: (stage) => set({ stageNumber: stage }),

        // Fetches the full populated profile (typically called once they hit the dashboard)
        fetchProfile: async (force = false) => {
          const state = get();
          
          // Avoid redundant calls if we already have the full profile and aren't forcing
          if (!force && state.profile && state.profile.name) {
            return;
          }

          set({ isLoadingProfile: true });
          try {
            const res = await getStudentProfileRequest();
            if (res.data) {
              set((state) => ({ 
                profile: res.data, 
                // 🔥 FIX: Only update stageNumber if the API actually sent it, otherwise keep the current one!
                stageNumber: res.data.stageNumber !== undefined ? res.data.stageNumber : state.stageNumber 
              }));
            }
          } catch (err) {
            console.error("Failed to fetch user profile:", err);
          } finally {
            set({ isLoadingProfile: false });
          }
        },

        // A lightweight call just to check where the user belongs in the onboarding flow
        syncStageNumber: async () => {
          try {
            const res = await getStageNumberRequest();
            
            if (!res) return null;

            let fetchedStage = null;
            if (typeof res === 'number') {
              fetchedStage = res;
            } else if (typeof res === 'string') {
              fetchedStage = parseInt(res, 10);
            } else if (res && res.data !== undefined) {
              fetchedStage = typeof res.data === 'number' ? res.data : parseInt(String(res.data), 10);
            } else if (res && typeof res === 'object' && 'stageNumber' in res) {
              const resObj = res as Record<string, unknown>;
              fetchedStage = typeof resObj.stageNumber === 'number' 
                ? resObj.stageNumber 
                : parseInt(String(resObj.stageNumber), 10);
            }

            if (fetchedStage === null || isNaN(fetchedStage)) {
              console.warn("syncStageNumber: Could not extract a valid stage number from response", res);
              return null;
            }
            
            set({ stageNumber: fetchedStage });
            
            // Also patch the profile state if it exists
            const currentProfile = get().profile;
            if (currentProfile) {
              set({ profile: { ...currentProfile, stageNumber: fetchedStage } });
            }
            
            return fetchedStage;
          } catch (err) {
            console.error("Failed to sync stage number:", err);
            return null;
          }
        },

        clearUser: () => {
          set({ profile: null, stageNumber: null, isLoadingProfile: false });
        }
      }),
      { 
        name: "user-store",
        // We only persist the data, not the loading state
        partialize: (state) => ({
          profile: state.profile,
          stageNumber: state.stageNumber
        }),
      }
    )
  )
);