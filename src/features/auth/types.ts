// src/features/auth/types.ts

export interface AccessTokenPayload {
  id: string;         
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}
