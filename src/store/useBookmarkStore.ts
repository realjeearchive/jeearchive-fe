"use client";

import { create } from "zustand";
import { fetchBookmarkedQuestions, removeBookmarkApi, BookmarkedQuestion } from "@/features/bookmarks/api";
import { toast } from "sonner";
import { authenticatedFetch } from "@/features/auth/api";

interface BookmarkStore {
  bookmarks: BookmarkedQuestion[];
  isLoading: boolean;
  error: string | null;

  fetchBookmarks: () => Promise<void>;
  addBookmark: (questionId: string) => Promise<void>;
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

  addBookmark: async (questionId: string) => {
    const previousBookmarks = get().bookmarks;
    
    // Optimistic UI: Add instantly
    const newBookmark: BookmarkedQuestion = {
      id: questionId,
    } as BookmarkedQuestion;
    
    set({ bookmarks: [...previousBookmarks, newBookmark] });

    try {
      const res = await authenticatedFetch(`/bookMarked/add`, {
        method: "POST",
        body: JSON.stringify({ questionId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData?.errors?.includes("Already Added")) return;
        throw new Error("Failed to add bookmark");
      }

      // Re-fetch bookmarks in background to sync full database details
      const data = await fetchBookmarkedQuestions();
      set({ bookmarks: data });
    } catch (err) {
      console.warn("[BookmarkStore] Add Error:", err);
      toast.error("Couldn't save bookmark. Check connection.");
      // Rollback if failed
      set({ bookmarks: previousBookmarks });
    }
  },

  removeBookmark: async (questionId: string) => {
    const previousBookmarks = get().bookmarks;
    
    // Optimistic UI: Remove instantly
    set({ bookmarks: previousBookmarks.filter((q) => q.id !== questionId) });

    try {
      await removeBookmarkApi(questionId);
    } catch (err) {
      console.warn("[BookmarkStore] Remove Error:", err);
      toast.error("Couldn't remove bookmark. Check connection.");
      // Rollback if failed
      set({ bookmarks: previousBookmarks });
    }
  }
}));