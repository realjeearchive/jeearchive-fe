// src/features/notification/api.ts

import { authenticatedFetch, ApiError } from "@/features/auth/api";
import { useRateLimitStore } from "@/store/useRateLimitStore";
import { NotificationItem } from "@/components/popups/NotificationPopup/NotificationPopup";

export interface NotificationListResponse {
  success: boolean;
  data: NotificationItem[];
  message?: string;
}

export const fetchMyNotifications = async (): Promise<NotificationListResponse> => {
  // Replace '/notification/get' with your exact GET endpoint if different
  const res = await authenticatedFetch(`/notification/get`, {
    method: "GET",
  });

  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || "Failed to fetch notifications", res.status);
  }

  return data;
};

export const markNotificationAsReadApi = async (notificationId: string): Promise<void> => {
  // Replace with your exact mark-as-read endpoint if different
  const res = await authenticatedFetch(`/notification/mark-read/${notificationId}`, {
    method: "PATCH",
  });

  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  if (!res.ok) {
    throw new ApiError("Failed to mark notification as read", res.status);
  }
};