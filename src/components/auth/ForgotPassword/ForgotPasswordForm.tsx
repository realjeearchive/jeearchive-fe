'use client';

import Styles from './ForgotPasswordForm.module.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import { forgotPasswordEmailSchema, type ForgotPasswordEmailInput } from '@/features/auth/schemas';
import { passwordEmailVerificationRequest } from '@/features/auth/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MdClose } from 'react-icons/md';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get('email') as string,
    };

    let parsed: ForgotPasswordEmailInput;

    try {
      parsed = forgotPasswordEmailSchema.parse(rawData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrs: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          if (!fieldErrs[field]) fieldErrs[field] = issue.message;
        });
        setFieldErrors(fieldErrs);
        setLoading(false);
        return;
      }
      setError('Invalid form data');
      setLoading(false);
      return;
    }

    try {
      console.info(`[Auth: ForgotPassword] Requesting OTP for: ${parsed.email}`);
      await passwordEmailVerificationRequest({ email: parsed.email });

      console.info(`[Auth: ForgotPassword] OTP sent successfully to: ${parsed.email}`);
      toast.success('If an account exists, a reset code has been sent to your email.');
      
      router.push(`/reset-password?email=${encodeURIComponent(parsed.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error(`[Auth: ForgotPassword] Request failed:`, err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.forgotPasswordFormContainer}>
      <div className={Styles.forgotPasswordHeader}>
        <Link 
          href="/login?method=email"
          className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[var(--text-secondary,theme(colors.gray.400))] hover:text-[var(--text-primary,theme(colors.white))] transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <MdClose size={16} />
        </Link>
        <h2 className={`${Styles.forgotPasswordHeading} text-2xl sm:text-3xl`}>Reset your password</h2>
        <p className={Styles.forgotPasswordSubtext}>
          Enter your email address and we will send you an OTP to reset your password.
        </p>
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.forgotPasswordForm}>
        <AuthInput id="email" name="email" type="email" label="Email address" required placeholder="Email" error={fieldErrors.email} />

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Verify Email</div>
        </AuthButton>

        <div className={Styles.backToLogin}>
          <Link href="/login?method=email" className={`${Styles.onboardingNavigation} font-medium`}>
            Back to <span className={Styles.loginNavigation}>login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}