'use client';

import Styles from './LoginForm.module.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.webp';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { loginRequest, type LoginResponse } from '@/features/auth/api';
import { useAuthStore, useUserStore } from '@/store';
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdEmail, MdClose } from 'react-icons/md';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showEmailForm, setShowEmailForm] = useState(searchParams.get('method') === 'email');
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const syncStageNumber = useUserStore((s) => s.syncStageNumber);

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
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrs: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          if (!fieldErrs[field]) fieldErrs[field] = issue.message;
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
      console.info(`[Auth: LoginForm] Attempting login for: ${parsed.email}`);
      const data: LoginResponse = await loginRequest(rawData);
      setAccessToken(data.accessToken); 
      
      console.info(`[Auth: LoginForm] Login successful for: ${parsed.email}`);
      toast.success('Logged in successfully.');
      // RouteGuard will automatically handle fetching the stage and redirecting
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      console.error(`[Auth: LoginForm] Login failed:`, err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${Styles.loginFormContainer} relative`}>
      <div className={Styles.loginHeader}>
        {!showEmailForm ? (
          <Image src={Logo} alt="jeearchive-logo" width={40} height={40} className={`${Styles.logo} mb-[18px]`} priority={true} />
        ) : (
          <button 
            type="button" 
            onClick={() => setShowEmailForm(false)} 
            className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[var(--text-secondary,theme(colors.gray.400))] hover:text-[var(--text-primary,theme(colors.white))] transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <MdClose size={16} />
          </button>
        )}
        <h2 className={`${Styles.loginHeading} text-[36px]`}>{!showEmailForm ? "Let's get started" : "Welcome back"}</h2>
        {!showEmailForm && (
          <p className="text-center text-[var(--auth-text-secondary,theme(colors.gray.400))] text-[15px] leading-[1.5] max-w-[290px]">
            Master your prep - practice chapter-wise PYQs and take mock tests with the real NTA interface.
          </p>
        )}
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.loginForm}>
        {!showEmailForm ? (
          <div className="flex flex-col gap-2 w-full max-w-[300px] mx-auto mt-7">
            <GoogleAuthButton />
            <AuthButton type="button" variant="secondary" className="h-10 text-[15px]" onClick={() => setShowEmailForm(true)}>
              <div className="flex items-center justify-center gap-2 font-medium">
                <MdEmail size={17} />
                <span>Continue with email</span>
              </div>
            </AuthButton>
          </div>
        ) : (
          <>
            <AuthInput id="email" name="email" type="email" label="Email address" required placeholder="Email" error={fieldErrors.email} />
            <AuthInput id="password" name="password" type="password" label="Password" required placeholder="Password" error={fieldErrors.password} />

            <div className={Styles.formExtras}>
              <div className={Styles.rememberMe}>
                <input id="remember-me" name="remember-me" type="checkbox" defaultChecked className={Styles.checkbox} />
                <label htmlFor="remember-me" className={Styles.checkboxLabel}>Remember me</label>
              </div>
              <Link href="/forgot-password" className={Styles.forgotPassword}>Forgot password?</Link>
            </div>

            <AuthButton type="submit" loading={loading}>
              <div className="font-medium">Sign in</div>
            </AuthButton>

            <p className={Styles.onboardingNavigationText}>
              {"Don't have an account?"}{' '}
              <Link href="/signup?method=email" className={`${Styles.onboardingNavigation} font-medium`}>Sign up</Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
}