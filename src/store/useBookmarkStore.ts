"use client";

import { create } from "zustand";
import { fetchBookmarkedQuestions, removeBookmarkApi, BookmarkedQuestion } from "@/features/bookmarks/api";
import { toast } from "sonner";
import { authenticatedFetch } from "@/features/auth/api";
import { get as getIdb, set as setIdb } from "idb-keyval";

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
    let hasCachedData = false;
    
    try {
      const cachedData = await getIdb("bookmarks_cache");
      if (cachedData && Array.isArray(cachedData)) {
        hasCachedData = true;
        set({ bookmarks: cachedData, isLoading: false, error: null });
      }
    } catch (e) {
      console.error("IDB get error", e);
    }

    if (!hasCachedData) {
      set({ isLoading: true, error: null });
    }

    try {
      const data = await fetchBookmarkedQuestions();
      set({ bookmarks: data, isLoading: false });
      try {
        await setIdb("bookmarks_cache", data);
      } catch (e) {
        console.error("IDB set error", e);
      }
    } catch (err) {
      console.warn("[BookmarkStore] Fetch Error:", err);
      if (!hasCachedData) {
        set({ error: "Failed to load bookmarks. Please refresh.", isLoading: false });
      }
    }
  },

  addBookmark: async (questionId: string) => {
    const previousBookmarks = get().bookmarks;
    
    // Optimistic UI: Add instantly
    const newBookmark: BookmarkedQuestion = {
      id: questionId,
    } as BookmarkedQuestion;
    
    const optimisticBookmarks = [...previousBookmarks, newBookmark];
    set({ bookmarks: optimisticBookmarks });

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
      try {
        await setIdb("bookmarks_cache", data);
      } catch (e) {
        console.error("IDB set error", e);
      }
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
    const optimisticBookmarks = previousBookmarks.filter((q) => q.id !== questionId);
    set({ bookmarks: optimisticBookmarks });
    try {
      await setIdb("bookmarks_cache", optimisticBookmarks);
    } catch (e) {
      console.error("IDB set error", e);
    }

    try {
      await removeBookmarkApi(questionId);
      // Wait to fetch latest in background if needed, but not strictly necessary for removal
    } catch (err) {
      console.warn("[BookmarkStore] Remove Error:", err);
      toast.error("Couldn't remove bookmark. Check connection.");
      // Rollback if failed
      set({ bookmarks: previousBookmarks });
      try {
        await setIdb("bookmarks_cache", previousBookmarks);
      } catch (e) {}
    }
  }
}));