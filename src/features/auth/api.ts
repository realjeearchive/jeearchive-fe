import type { SignupInput, LoginInput } from './schemas';


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';


export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}


async function handleJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      'Something went wrong. Please try again.';
    throw new ApiError(message, res.status)
  }

  if (data && data.data !== undefined) {
    return { ...data, ...data.data } as T;
  }

  return data as T;
}


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


export async function signupRequest(payload: SignupInput) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),
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
    credentials: 'include', // sets refreshToken cookie
    body: JSON.stringify(payload),
  });

  return handleJson<LoginResponse>(res);
}

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

export async function refreshTokenRequest() {
  
  const res = await fetch(`${API_BASE_URL}/auth/refershToken`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',        
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',                   
  });

  return handleJson<RefreshTokenResponse>(res);
}


export const getCurrentSession = refreshTokenRequest;