'use client';

import Styles from './LoginForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { loginRequest, type LoginResponse } from '@/features/auth/api';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      remberMe: formData.get('remember-me') === 'on',
    };

    let parsed: LoginInput;

    try {
      parsed = loginSchema.parse(rawData);
      console.log('LoginForm: parsed data: ', parsed);
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
      const data: LoginResponse = await loginRequest(rawData);

      setAccessToken(data.accessToken);
      toast.success('Logged in successfully.');
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.loginFormContainer}>
      <div className={Styles.loginHeader}>
        <Image
          src={Logo}
          alt="jeearchive-logo"
          width={60}
          height={60}
          className={Styles.logo}
        />
        <h2 className={Styles.loginHeading}>Welcome back</h2>
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.loginForm}>
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

        <div className={Styles.formExtras}>
          <div className={Styles.rememberMe}>
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className={Styles.checkbox}
            />
            <label htmlFor="remember-me" className={Styles.checkboxLabel}>
              Remember me
            </label>
          </div>

          <Link href="/forgot-password" className={Styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Sign in</div>
        </AuthButton>

        <p className={Styles.onboardingNavigationText}>
          {"Don't have an account?"}{' '}
          <Link
            href="/signup"
            className={`${Styles.onboardingNavigation} font-medium`}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
