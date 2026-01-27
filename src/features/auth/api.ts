// src/features/auth/api.ts
import { useAuthStore } from "@/store/authStore";
import type { SignupInput, LoginInput } from './schemas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// --- SHARED PROMISE LOCK (The Fix) ---
// This holds the active refresh request. All failed 401s will await this SAME promise.
let refreshPromise: Promise<string> | null = null;

// --- AUTHENTICATED FETCH WRAPPER ---
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const store = useAuthStore.getState();
  const token = store.accessToken;

  // 1. Prepare Headers
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

  // 2. Attempt Request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // 3. Intercept 401
  if (response.status === 401) {
    // Don't retry if the refresh endpoint itself fails
    if (endpoint.includes('refershToken')) {
      return response;
    }

    try {
      // 4. Get New Token (Wait for existing refresh if one is happening)
      const newToken = await getRefreshToken();

      // 5. Retry Original Request with New Token
      headers.set('Authorization', `Bearer ${newToken}`);
      // Important: Create a new config object with updated headers
      return fetch(`${API_BASE_URL}${endpoint}`, { ...config, headers });
    } catch (err) {
      // Refresh failed (completely logged out)
      store.logout();
      return response;
    }
  }

  return response;
}

// --- SINGLETON REFRESH LOGIC ---
async function getRefreshToken(): Promise<string> {
  // If a refresh is already in progress, return the existing promise!
  if (refreshPromise) {
    return refreshPromise;
  }

  // Otherwise, start a new refresh
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

      const data = await res.json();
      const newToken = data.data?.accessToken || data.accessToken;

      if (!newToken) throw new Error("No token returned");

      // Update Store
      useAuthStore.getState().setAccessToken(newToken);
      
      return newToken;
    } catch (error) {
      throw error;
    } finally {
      // Clear the lock so future 401s can start a new refresh
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// --- HELPER HANDLER ---
async function handleJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    let message = 'Something went wrong.';
    // Safe check for message
    if (data && typeof data === 'object' && 'message' in data) {
      message = String((data as { message: unknown }).message);
    }
    throw new ApiError(message, res.status);
  }

  // FIXED: Strict Spread logic to prevent "Spread types may only be created from object types"
  if (data && typeof data === 'object' && 'data' in data) {
    const wrapper = data as Record<string, unknown>;
    // Only spread if inner data is a valid object and NOT an array
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
export async function signupRequest(payload: SignupInput) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify(payload),
  });
  return handleJson<SignupResponse>(res);
}

export async function verifyOtpRequest(params: { email: string; otp: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/verifySignUpOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  return handleJson<VerifyOtpResponse>(res);
}

export async function loginRequest(payload: LoginInput & { remberMe?: boolean }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify(payload),
  });
  return handleJson<LoginResponse>(res);
}

export async function passwordEmailVerificationRequest(params: { email: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/passwordEmailVerification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  return handleJson<PasswordEmailVerificationResponse>(res);
}

export async function verifyPasswordOtpRequest(params: { email: string; otp: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/verifyPasswordOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  return handleJson<VerifyPasswordOtpResponse>(res);
}

export async function passwordChangeRequest(params: { password: string; accessToken: string }) {
  const res = await authenticatedFetch(`/auth/passwordChange`, {
    method: 'POST',
    body: JSON.stringify({ password: params.password }),
  });
  return handleJson<PasswordChangeResponse>(res);
}

// EXPORTED REFRESH FUNCTION 
export async function refreshTokenRequest() {
  try {
    const accessToken = await getRefreshToken(); 
    return { accessToken, message: "Token refreshed" };
  } catch (error) {
    throw error;
  }
}

export const getCurrentSession = refreshTokenRequest;