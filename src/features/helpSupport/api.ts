// src/features/helpSupport/api.ts

import { authenticatedFetch, ApiError } from "@/features/auth/api";

interface SupportEmailPayload {
  content: string;
}

interface SupportEmailResponse {
  message: string;
  data: string;
  success: boolean;
}

// --- RESPONSE HANDLER ---
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

  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
      return { ...wrapper, data: wrapper.data } as T;
    }
  }

  return data as T;
}

export const sendEmailToSupport = async (payload: SupportEmailPayload): Promise<SupportEmailResponse> => {
  console.info("[API: HelpSupport] Sending support email with payload:", payload);
  
  const res = await authenticatedFetch(`/notification/sendEmailToSupport`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  return handleJson<SupportEmailResponse>(res);
};