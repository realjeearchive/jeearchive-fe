"use client";

import { create } from "zustand";
import { fetchBookmarkedQuestions, removeBookmarkApi, BookmarkedQuestion } from "@/features/bookmarks/api";
import { toast } from "sonner";

interface BookmarkStore {
  bookmarks: BookmarkedQuestion[];
  isLoading: boolean;
  error: string | null;

  fetchBookmarks: () => Promise<void>;
  removeBookmark: (questionId: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  isLoading: true,
  error: null,

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchBookmarkedQuestions();
      set({ bookmarks: data, isLoading: false });
    } catch (err) {
      console.warn("[BookmarkStore] Fetch Error:", err);
      set({ error: "Failed to load bookmarks. Please refresh.", isLoading: false });
    }
  },

  removeBookmark: async (questionId: string) => {
    const previousBookmarks = get().bookmarks;
    
    // Optimistic UI: Remove instantly
    set({ bookmarks: previousBookmarks.filter((q) => q.id !== questionId) });

    try {
      await removeBookmarkApi(questionId);
      toast.success("Bookmark removed");
    } catch (err) {
      console.warn("[BookmarkStore] Remove Error:", err);
      toast.error("Couldn't remove bookmark. Check connection.");
      // Rollback if failed
      set({ bookmarks: previousBookmarks });
    }
  }
}));