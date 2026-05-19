// src/features/dashboard/api.ts

import { DashboardDataPayload } from "@/store/useDashboardStore";
import { authenticatedFetch, ApiError } from "@/features/auth/api"; 

export interface ApiResponse {
  message: string;
  data: DashboardDataPayload;
  success: boolean;
}

// --- RESPONSE HANDLER (Strictly Typed) ---
async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      // Safely cast to a Record instead of using 'any'
      const errorData = data as Record<string, unknown>;
      message = String(errorData.message);
    }
    throw new ApiError(message, res.status);
  }

  // Safe type narrowing without 'any'
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