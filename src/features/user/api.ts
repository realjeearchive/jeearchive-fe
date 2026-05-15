import { authenticatedFetch, handleJson } from "@/features/auth/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// --- TYPES ---
export interface StageNumberResponse {
  message: string;
  data: number; // 🔥 The actual stage number lives here!
  success?: boolean;
}

export interface Stage1Input {
  className: string;
}

export interface Stage2Input {
  category: string;
  gender: string;
}

export interface Stage3Input {
  countryCode: string;
  mobileNumber: number; // Storing as number based on your postman screenshot
}

export interface GenericSuccessResponse {
  message: string;
  // Include any other generic success fields your backend returns
}

// Student Profile Type (Adjust based on your exact backend response)
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  className?: string;
  category?: string;
  gender?: string;
  mobileNumber?: number;
  countryCode?: string;
  stageNumber: number;
}

export interface ProfileResponse {
  data: StudentProfile;
  message?: string;
}

// --- API REQUESTS ---

// GET: Fetch current stage number
export async function getStageNumberRequest() {
  const res = await authenticatedFetch(`/user/stageNumber`, {
    method: 'GET',
  });
  return handleJson<StageNumberResponse>(res);
}

// POST: Stage 1 (Class)
export async function submitStage1Request(payload: Stage1Input) {
  const res = await authenticatedFetch(`/user/stage1`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

// POST: Stage 2 (Personal Details)
export async function submitStage2Request(payload: Stage2Input) {
  const res = await authenticatedFetch(`/user/stage2`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

// POST: Stage 3 (Contact)
export async function submitStage3Request(payload: Stage3Input) {
  const res = await authenticatedFetch(`/user/stage3`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

// GET: Full Student Profile
export async function getStudentProfileRequest() {
  const res = await authenticatedFetch(`/user/get`, {
    method: 'GET',
  });
  return handleJson<ProfileResponse>(res);
}