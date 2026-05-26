// src/features/streak/api.ts
import { authenticatedFetch, ApiError } from "@/features/auth/api";

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  questionsToday: number;
  lastActiveDate: string;
}

export interface StreakApiResponse {
  message: string;
  data: StreakData;
  success: boolean;
}

export const fetchStreakData = async (): Promise<StreakApiResponse> => {
  const res = await authenticatedFetch(`/analytics/streak`, {
    method: "GET",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || "Failed to fetch streak data", res.status);
  }

  return data;
};