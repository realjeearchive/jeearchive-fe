// src/features/auth/schemas.ts

import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z
    .string()
    .email('Enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .max(100, 'Email must be at most 100 characters'),
});

export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d+$/, 'OTP must be numeric'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be at most 100 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


export type LoginInput = z.infer<typeof loginSchema>;
