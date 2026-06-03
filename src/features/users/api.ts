// src/features/users/api.ts

import { authenticatedFetch, handleJson } from "@/features/auth/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// --- TYPES ---
export interface StageNumberResponse {
  message: string;
  data: number;
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
  mobileNumber: number;
}

// 🔥 NEW: Update Profile Input matching your Postman payload
export interface UpdateProfileInput {
  name: string;
  mobileNumber: number;
  countryCode: string;
  gender: string;
  category: string;
  className: string;
}

export interface GenericSuccessResponse {
  message: string;
  success?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  className?: string;
  class?: string; // Sometimes returned as 'class' by backend GET request
  category?: string;
  gender?: string;
  mobileNumber?: number | string;
  countryCode?: string;
  stageNumber: number;
}

export interface ProfileResponse {
  data: StudentProfile;
  message?: string;
}

// --- API REQUESTS ---

export async function getStageNumberRequest() {
  const res = await authenticatedFetch(`/user/stageNumber`, {
    method: 'GET',
  });
  return handleJson<StageNumberResponse>(res);
}

export async function submitStage1Request(payload: Stage1Input) {
  const res = await authenticatedFetch(`/user/stage1`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

export async function submitStage2Request(payload: Stage2Input) {
  const res = await authenticatedFetch(`/user/stage2`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

export async function submitStage3Request(payload: Stage3Input) {
  const res = await authenticatedFetch(`/user/stage3`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}

export async function getStudentProfileRequest() {
  const res = await authenticatedFetch(`/user/get`, {
    method: 'GET',
  });
  return handleJson<ProfileResponse>(res);
}

// 🔥 NEW: Update Profile Request
export async function updateProfileRequest(payload: UpdateProfileInput) {
  const res = await authenticatedFetch(`/user/update`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleJson<GenericSuccessResponse>(res);
}