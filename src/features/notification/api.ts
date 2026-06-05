// src/features/notification/api.ts
import { authenticatedFetch, ApiError } from "@/features/auth/api";
import { useRateLimitStore } from "@/store/useRateLimitStore";

// The raw structure coming from your backend (as seen in Postman)
export interface RawNotificationItem {
  id: string;
  subject: string;
  content: string;
  studentId: string;
  created_at: string;
  sendingMedium: string[];
  from: string;
  to: string;
  type: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: RawNotificationItem[];
  message?: string;
}

export const fetchMyNotifications = async (): Promise<NotificationListResponse> => {
  // Updated to match the endpoint in your Postman screenshot
  const res = await authenticatedFetch(`/notification/getNotification`, {
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