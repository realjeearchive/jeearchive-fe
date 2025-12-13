// src/features/auth/api.ts
import type { SignupInput, LoginInput } from './schemas';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function handleJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      'Something went wrong. Please try again.';
    throw new Error(message);
  }

  // Your ApiResponse shape is { message, data?: {...} }
  if (data && data.data !== undefined) {
    return { ...data, ...data.data } as T;
  }

  return data as T;
}

// ===== Types that match backend =====

export interface SignupResponse {
  message: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  message: string;
}

export interface PasswordEmailVerificationResponse {
  message: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface VerifyPasswordOtpResponse {
  accessToken: string;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  message: string;
}

// ===== API calls =====

// POST /auth/signup
export async function signupRequest(payload: SignupInput) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // set refresh cookie in future if needed
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),
  });

  return handleJson<SignupResponse>(res);
}

// POST /auth/verifySignUpOTP  (signup verification)
export async function verifyOtpRequest(params: { email: string; otp: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/verifySignUpOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  // data.data = { accessToken }
  return handleJson<VerifyOtpResponse>(res);
}

// POST /auth/login
export async function loginRequest(payload: LoginInput & { remberMe?: boolean }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // sets refreshToken cookie
    body: JSON.stringify(payload),
  });

  return handleJson<LoginResponse>(res);
}

// POST /auth/passwordEmailVerification
export async function passwordEmailVerificationRequest(params: {
  email: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/passwordEmailVerification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  return handleJson<PasswordEmailVerificationResponse>(res);
}

// POST /auth/verifyPasswordOTP
export async function verifyPasswordOtpRequest(params: {
  email: string;
  otp: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/verifyPasswordOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  return handleJson<VerifyPasswordOtpResponse>(res);
}

// POST /auth/passwordChange  (requires Authorization: Bearer accessToken)
export async function passwordChangeRequest(params: {
  password: string;
  accessToken: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/passwordChange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify({ password: params.password }),
  });

  return handleJson<PasswordChangeResponse>(res);
}

// GET /auth/refershToken
export async function refreshTokenRequest() {
  const res = await fetch(`${API_BASE_URL}/auth/refershToken`, {
    method: 'GET',
    credentials: 'include', // send refreshToken cookie
  });

  return handleJson<RefreshTokenResponse>(res);
}
