'use client';

import Styles from './SignupForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import { signupSchema, type SignupInput } from '@/features/auth/schemas';
import { signupRequest, type SignupResponse } from '@/features/auth/api';
import { toast } from 'sonner';

export function SignupForm() {
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
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirm-password') as string,
    };

    let parsed: SignupInput;

    try {
      parsed = signupSchema.parse(rawData);
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
        toast.error('Please fix the highlighted fields.');
        setLoading(false);
        return;
      }

      setError('Invalid form data');
      setLoading(false);
      return;
    }

    try {
      const data: SignupResponse = await signupRequest(parsed);
      toast.success(data.message || 'OTP sent to your email.');

      // FIX: Add the redirectTo parameter here!
      router.push(`/verify-email?email=${encodeURIComponent(parsed.email)}&redirectTo=/onboarding`);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.signupFormContainer}>
      <div className={Styles.signupHeader}>
        <Image
          src={Logo}
          alt="jeearchive-logo"
          width={60}
          height={60}
          className={Styles.logo}
        />
        <h2 className={Styles.signupHeading}>{"Let's get started"}</h2>
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.signupForm}>
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          required
          placeholder="Full Name"
          error={fieldErrors.name}
        />

        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          placeholder="Email"
          error={fieldErrors.email}
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          required
          placeholder="Password"
          error={fieldErrors.password}
        />

        <AuthInput
          id="confirm-password"
          name="confirm-password"
          type="password"
          label="Confirm Password"
          required
          placeholder="Confirm Password"
          error={fieldErrors.confirmPassword}
        />

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Create account</div>
        </AuthButton>

        <p className={Styles.onboardingNavigationText}>
          Already have an account?{' '}
          <Link
            href="/login"
            className={`${Styles.onboardingNavigation} font-medium`}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}