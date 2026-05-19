import { authenticatedFetch, ApiError } from "@/features/auth/api";
import { AnalyticsDataPayload } from "@/store/useAnalyticsStore";

export interface AnalyticsApiResponse {
  message: string;
  data: AnalyticsDataPayload;
  success: boolean;
}

// --- STRICT RESPONSE HANDLER ---
async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      const errorData = data as Record<string, unknown>;
      message = String(errorData.message);
    }
    throw new ApiError(message, res.status);
  }

  // Safe type narrowing
  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
      return { ...wrapper, data: wrapper.data } as T;
    }
  }

  return data as T;
}

// ==========================================
// API CALLS
// ==========================================

export const fetchAnalyticsData = async (): Promise<AnalyticsApiResponse> => {
  console.info("[API: Analytics] Querying overall student performance timelines...");
  const res = await authenticatedFetch(`/analytics/analyticsWindow`, {
    method: "GET",
  });
  
  return handleJson<AnalyticsApiResponse>(res);
};