"use client";

import { create } from "zustand";
import { fetchMyNotifications } from "@/features/notification/api";
import { NotificationItem } from "@/components/popups/NotificationPopup/NotificationPopup";

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => void; // No longer a Promise since there is no API call
}

// --- Local Storage Helpers ---
const STORAGE_KEY = "jeearchive_read_notifications";

const getReadIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveReadId = (id: string) => {
  if (typeof window === "undefined") return;
  try {
    const readIds = getReadIds();
    readIds.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
  } catch (error) {
    console.error("Failed to save read notification to local storage", error);
  }
};
// -----------------------------

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchMyNotifications();
      
      if (response?.success && response?.data) {
        const readIds = getReadIds();

        // Map the backend raw data to our frontend NotificationItem interface
        const mappedNotifications: NotificationItem[] = response.data.map((raw) => ({
          id: raw.id,
          subject: raw.subject,
          content: raw.content,
          createdAt: raw.created_at, // Map backend created_at to frontend createdAt
          isRead: readIds.has(raw.id), // Determine read status from local storage
        }));

        // Sort newest first
        const sorted = mappedNotifications.sort((a, b) => 
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

  markAsRead: (id: string) => {
    // 1. Save to Local Storage permanently for this browser
    saveReadId(id);

    // 2. Update the Zustand state to instantly clear the dot in the UI
    const currentNotifications = get().notifications;
    const updated = currentNotifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    
    const unread = updated.filter(n => !n.isRead).length;
    
    set({ notifications: updated, unreadCount: unread });
  }
}));