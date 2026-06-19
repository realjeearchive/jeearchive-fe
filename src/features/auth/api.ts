// src/features/auth/api.ts
import { useAuthStore } from "@/store/authStore";
import type { SignupInput, LoginInput } from './schemas';
import { toast } from "sonner";
// 🚨 NEW: Import the decrypt utility
import { decryptData } from "@/lib/decrypt"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

let refreshPromise: Promise<string> | null = null;
const inFlightRequests = new Map<string, Promise<Response>>();

// 🚨 NEW: Global Decryption Interceptor
async function processEncryptedResponse(response: Response): Promise<Response> {
  if (!response.ok) return response; // Let error handlers deal with non-200s

  const clonedRes = response.clone();
  const rawText = await clonedRes.text().catch(() => "");
  
  if (!rawText) return response;

  let modifiedBody = rawText;
  let wasEncrypted = false;

  // Scenario 1: Raw encrypted string ("ivHex:cipherHex")
  if (rawText.includes(':') && !rawText.trim().startsWith('{') && !rawText.trim().startsWith('[')) {
    const decrypted = decryptData<unknown>(rawText);
    if (decrypted !== null) {
      modifiedBody = JSON.stringify(decrypted);
      wasEncrypted = true;
    }
  } 
  // Scenario 2: Wrapped encryption ({ "success": true, "data": "ivHex:cipherHex" })
  else if (rawText.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === 'object' && typeof parsed.data === 'string' && parsed.data.includes(':')) {
        const decryptedInner = decryptData<unknown>(parsed.data);
        if (decryptedInner !== null) {
          parsed.data = decryptedInner;
          modifiedBody = JSON.stringify(parsed);
          wasEncrypted = true;
        }
      }
    } catch (e) {
      // Ignore parsing errors, pass original response
    }
  }

  // Re-package into a standard Response object so the rest of the app doesn't break
  if (wasEncrypted) {
    return new Response(modifiedBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  return response;
}

export async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const store = useAuthStore.getState();
  const token = store.accessToken;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const requestKey = `${options.method || 'GET'}:${endpoint}`;

  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey)!;
  }

  const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401 || response.status === 403) {
        if (endpoint.includes('refershToken')) {
          return response;
        }

        console.warn(`[API: Auth] 401/403 received for ${endpoint}. Attempting token refresh...`);
        try {
          const newToken = await getRefreshToken();
          headers.set('Authorization', `Bearer ${newToken}`);
          console.info(`[API: Auth] Token refreshed successfully. Retrying ${endpoint}...`);
          
          const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, headers });
          return processEncryptedResponse(retryRes); // 🚨 Decrypt retried requests
        } catch (err) {
          console.error(`[API: Auth] Token refresh failed. Logging user out.`, err);
          store.logout();
          return response;
        }
      }
      
      return processEncryptedResponse(response); // 🚨 Decrypt normal requests
    })
    .finally(() => {
      setTimeout(() => inFlightRequests.delete(requestKey), 300);
    });

  inFlightRequests.set(requestKey, fetchPromise);
  return fetchPromise;
}

async function getRefreshToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refershToken`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Refresh failed");

      // We decrypt the refresh token response too, just in case!
      const decryptedRes = await processEncryptedResponse(res);
      const data = await decryptedRes.json();
      const newToken = data.data?.accessToken || data.accessToken;

      if (!newToken) throw new Error("No token returned");

      useAuthStore.getState().setAccessToken(newToken);
      return newToken;
    } catch (error) {
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function handleJson<T>(res: Response): Promise<T> {
  if (res.status === 429) {
    toast.error("You're moving too fast!", {
      description: "Network is busy. Please wait a few seconds and refresh.",
      duration: 4000,
    });
    throw new ApiError("Too many requests. Please wait.", 429);
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    if (data && typeof data === 'object' && 'message' in data) {
      message = String((data as { message: unknown }).message);
    }
    throw new ApiError(message, res.status);
  }

  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    if (wrapper.data && typeof wrapper.data === 'object' && !Array.isArray(wrapper.data)) {
       return { ...wrapper, ...(wrapper.data as object) } as T;
    }
  }

  return data as T;
}

// --- TYPES ---
export interface SignupResponse { message: string; }
export interface VerifyOtpResponse { accessToken: string; message: string; }
export interface LoginResponse { accessToken: string; message: string; }
export interface PasswordEmailVerificationResponse { message: string; }
export interface PasswordChangeResponse { message: string; }
export interface VerifyPasswordOtpResponse { accessToken: string; message: string; }
export interface RefreshTokenResponse { accessToken: string; message: string; }

// --- AUTH REQUESTS ---
// 🚨 Notice how we pass all raw fetch calls through `processEncryptedResponse`
export async function signupRequest(payload: SignupInput) {
  let res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify(payload),
  });
  res = await processEncryptedResponse(res);
  return handleJson<SignupResponse>(res);
}

export async function verifyOtpRequest(params: { email: string; otp: string }) {
  let res = await fetch(`${API_BASE_URL}/auth/verifySignUpOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  res = await processEncryptedResponse(res);
  return handleJson<VerifyOtpResponse>(res);
}

export async function loginRequest(payload: LoginInput & { remberMe?: boolean }) {
  let res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify(payload),
  });
  res = await processEncryptedResponse(res);
  return handleJson<LoginResponse>(res);
}

export async function passwordEmailVerificationRequest(params: { email: string }) {
  let res = await fetch(`${API_BASE_URL}/auth/passwordEmailVerification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  res = await processEncryptedResponse(res);
  return handleJson<PasswordEmailVerificationResponse>(res);
}

export async function verifyPasswordOtpRequest(params: { email: string; otp: string }) {
  let res = await fetch(`${API_BASE_URL}/auth/verifyPasswordOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  res = await processEncryptedResponse(res);
  return handleJson<VerifyPasswordOtpResponse>(res);
}

export async function passwordChangeRequest(params: { password: string; accessToken: string }) {
  let res = await fetch(`${API_BASE_URL}/auth/passwordChange`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${params.accessToken}` 
    },
    credentials: 'include',
    body: JSON.stringify({ 
      password: params.password,
    }),
  });
  res = await processEncryptedResponse(res);
  return handleJson<PasswordChangeResponse>(res);
}

export async function refreshTokenRequest() {
  try {
    const accessToken = await getRefreshToken(); 
    return { accessToken, message: "Token refreshed" };
  } catch (error) {
    throw error;
  }
}

export const getCurrentSession = refreshTokenRequest;

export async function googleLoginRequest(params: { idToken: string }) {
  let res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  res = await processEncryptedResponse(res);
  return handleJson<LoginResponse>(res);
}