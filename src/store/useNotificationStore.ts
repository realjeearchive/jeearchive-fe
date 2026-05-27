// src/store/useNotificationStore.ts

"use client";

import { create } from "zustand";
import { fetchMyNotifications, markNotificationAsReadApi } from "@/features/notification/api";
import { NotificationItem } from "@/components/popups/NotificationPopup/NotificationPopup";

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchMyNotifications();
      if (response?.success && response?.data) {
        // Sort newest first
        const sorted = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const unread = sorted.filter(n => !n.isRead).length;
        
        set({ notifications: sorted, unreadCount: unread, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.warn("[Store: Notification] Failed to load", error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    // Optimistic UI Update: Instantly clear the dot in the UI
    const currentNotifications = get().notifications;
    const updated = currentNotifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    const unread = updated.filter(n => !n.isRead).length;
    
    set({ notifications: updated, unreadCount: unread });

    // Background API call to tell the server
    try {
      await markNotificationAsReadApi(id);
    } catch (error) {
      console.error("[Store: Notification] Failed to mark as read server-side", error);
      // If you want, you could revert the optimistic update here on failure
    }
  }
}));