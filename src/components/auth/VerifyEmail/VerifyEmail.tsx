'use client';

import Styles from './VerifyEmail.module.css';
import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import { verifyOtpRequest, passwordEmailVerificationRequest, type VerifyOtpResponse } from '@/features/auth/api';

// 🔥 FIX 1: Import useUserStore
import { useAuthStore, useUserStore } from '@/store';
import { toast } from 'sonner';

export function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';
  
  // 🔥 FIX 2: Change the fallback from '/dashboard' to '/onboarding'
  const redirectTo = searchParams.get('redirectTo') ?? '/onboarding';

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  
  // 🔥 FIX 3: Bring in setStageNumber and syncStageNumber
  const setStageNumber = useUserStore((s) => s.setStageNumber);
  const syncStageNumber = useUserStore((s) => s.syncStageNumber);

  useEffect(() => {
    if (!emailFromQuery) {
      console.warn('[Auth: VerifyEmail] No email found in query params. Redirecting to signup.');
      router.replace('/signup');
    }
  }, [emailFromQuery, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (otp[index] !== '') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (!emailFromQuery) {
      setError('Missing email. Please sign up again.');
      return;
    }

    setLoading(true);
    try {
      console.info(`[Auth: VerifyEmail] Attempting OTP verification for: ${emailFromQuery}`);
      const data: VerifyOtpResponse = await verifyOtpRequest({
        email: emailFromQuery,
        otp: otpValue,
      });

      // 🔥 FIX 4: Explicitly set stageNumber to 1 BEFORE setting the access token.
      // This guarantees your app route guards know they belong in /onboarding.
      setStageNumber(1);
      
      setAccessToken(data.accessToken); 
      
      // Kick off a background sync to ensure the full profile gets hydrated
      syncStageNumber();

      console.info(`[Auth: VerifyEmail] Verification successful for: ${emailFromQuery}`);
      toast.success('Email verified successfully.');
      
      router.push(redirectTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      console.error(`[Auth: VerifyEmail] Verification failed:`, err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    if (!emailFromQuery) return;

    setResendLoading(true);
    try {
      console.info(`[Auth: VerifyEmail] Attempting OTP resend for: ${emailFromQuery}`);
      await passwordEmailVerificationRequest({ email: emailFromQuery });
      console.info(`[Auth: VerifyEmail] OTP resend successful.`);
      toast.success('OTP sent successfully.');
    } catch (err) {
      const message = 'Failed to resend OTP. Please try again.';
      console.error(`[Auth: VerifyEmail] OTP resend failed:`, err);
      setError(message);
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={Styles.verificationFormContainer}>
      <div className={Styles.verificationHeader}>
        <Image src={Logo} alt="jeearchive-logo" width={60} height={60} className={Styles.logo} />
        <h2 className={Styles.verificationHeading}>Verify your email</h2>
        <p className={Styles.verificationSubtext}>
          We have sent a 6-digit code to <span className={Styles.emailText}>{emailFromQuery}</span>. Please enter it below.
        </p>
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.verificationForm}>
        <div className={Styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={Styles.otpInput}
              autoFocus={index === 0}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Verify Email</div>
        </AuthButton>

        <div className={Styles.resendSection}>
          <p className={Styles.resendText}>
            Did not receive the code?{' '}
            <button type="button" onClick={handleResendOTP} className={Styles.resendButton} disabled={resendLoading}>
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </p>
        </div>

        <p className={Styles.onboardingNavigationText}>
          Wrong email?{' '}
          <Link href="/signup" className={`${Styles.onboardingNavigation} font-medium`}>Go back</Link>
        </p>
      </form>
    </div>
  );
}