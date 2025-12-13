'use client';

import Styles from './ResetPassword.module.css';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/features/auth/schemas';
import {
  verifyPasswordOtpRequest,
  passwordChangeRequest,
  type VerifyPasswordOtpResponse,
} from '@/features/auth/api';
import { toast } from 'sonner';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      otp: formData.get('otp') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirm-password') as string,
    };

    let parsed: ResetPasswordInput;

    try {
      parsed = resetPasswordSchema.parse(rawData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrs: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          if (!fieldErrs[field]) {
            fieldErrs[field] = issue.message;
          }
        });
        setFieldErrors(fieldErrs);
        setLoading(false);
        return;
      }

      setError('Invalid form data');
      setLoading(false);
      return;
    }

    if (!emailFromQuery) {
      setError('Missing email. Please start from “Forgot password” again.');
      setLoading(false);
      return;
    }

    try {
  const otpData: VerifyPasswordOtpResponse =
    await verifyPasswordOtpRequest({
      email: emailFromQuery,
      otp: parsed.otp,
    });

  const accessToken = otpData.accessToken;

  await passwordChangeRequest({
    password: parsed.password,
    accessToken,
  });

  setSuccessMessage(
    'Password changed successfully. Please log in with your new password.'
  );
  toast.success('Password changed successfully. Please log in.');

  setTimeout(() => {
    router.push('/login');
  }, 1500);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Something went wrong';
  setError(message);
  toast.error(message);
} finally {
  setLoading(false);
}
  };

  return (
    <div className={Styles.resetPasswordFormContainer}>
      <div className={Styles.resetPasswordHeader}>
        <Image
          src={Logo}
          alt="jeearchive-logo"
          width={60}
          height={60}
          className={Styles.logo}
        />
        <h2 className={Styles.resetPasswordHeading}>Reset your password</h2>
        <p className={Styles.resetPasswordSubtext}>
          Enter the 6-digit code sent to your email and choose a new password.
        </p>
      </div>

      <FormError message={error} />

      {successMessage && (
        <p className={Styles.successText}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className={Styles.resetPasswordForm}>
        <AuthInput
          id="otp"
          name="otp"
          type="text"
          label="Verification code"
          required
          placeholder="Enter 6-digit code"
          error={fieldErrors.otp}
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="New password"
          required
          placeholder="••••••••"
          error={fieldErrors.password}
        />

        <AuthInput
          id="confirm-password"
          name="confirm-password"
          type="password"
          label="Confirm new password"
          required
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
        />

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Reset password</div>
        </AuthButton>

        <div className={Styles.backToLogin}>
          <Link
            href="/login"
            className={`${Styles.onboardingNavigation} font-medium`}
          >
            Back to <span className={Styles.loginNavigation}>login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
