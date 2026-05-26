import { DashboardDataPayload } from "@/store/useDashboardStore";
import { authenticatedFetch, ApiError } from "@/features/auth/api"; 
// 🚨 NEW: Import the rate limit store
import { useRateLimitStore } from "@/store/useRateLimitStore"; 

export interface ApiResponse {
  message: string;
  data: DashboardDataPayload;
  success: boolean;
}

async function handleJson<T>(res: Response): Promise<T> {
  // 🚨 REMOVED TOAST, ADDED STORE TRIGGER
  if (res.status === 429) {
    useRateLimitStore.getState().setRateLimited(true);
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      const errorData = data as Record<string, unknown>;
      message = String(errorData.message);
    }
    throw new ApiError(message, res.status);
  }

  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
      return { ...wrapper, data: wrapper.data } as T;
    }
  }

  return data as T;
}

export const fetchDashboardData = async (): Promise<ApiResponse> => {
  console.info("[API: Dashboard] Requesting student aggregate performance metrics...");
  
  const res = await authenticatedFetch(`/analytics/dashboard`, {
    method: "GET",
  });
  
  return handleJson<ApiResponse>(res);
};