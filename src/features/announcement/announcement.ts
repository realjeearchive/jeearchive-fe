import { authenticatedFetch, ApiError } from "@/features/auth/api";
import { useRateLimitStore } from "@/store/useRateLimitStore";

export interface BackendBannerData {
  id: number;
  isbanner: boolean;
  reason: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface BannerResponse {
  status: string;
  data: BackendBannerData;
  success?: boolean;
}

// --- STRICT RESPONSE HANDLER (Matches your existing pattern) ---
async function handleJson<T>(res: Response): Promise<T> {
  // 🚨 Trigger the global modal for rate limiting
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

export const fetchBannerData = async (): Promise<BackendBannerData | null> => {
  try {
    console.info("[API: Announcement] Fetching banner data...");
    
    // Using authenticatedFetch so it gets the authorizations automatically
    const res = await authenticatedFetch(`/banner/get`, {
      method: "GET",
    });

    const response = await handleJson<BannerResponse>(res);
    return response.data || null;
    
  } catch (error) {
    console.error("[API: Announcement] Banner fetch error:", error);
    return null;
  }
};