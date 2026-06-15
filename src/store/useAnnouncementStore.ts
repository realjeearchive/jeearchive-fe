import { create } from "zustand";
import { fetchBannerData, BackendBannerData } from "@/features/announcement/announcement";

interface AnnouncementStore {
  banner: BackendBannerData | null;
  isLoading: boolean;
  fetchBanner: () => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  banner: null,
  isLoading: false,
  fetchBanner: async () => {
    set({ isLoading: true });
    const data = await fetchBannerData();
    set({ banner: data, isLoading: false });
  },
}));