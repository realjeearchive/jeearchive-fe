'use client';

import Styles from './ForgotPasswordForm.module.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';
import { VerifyEmail } from '../VerifyEmail/VerifyEmail';

type ForgotPasswordStep = 'email' | 'verify';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Email not found');
      }

      // Move to OTP verification step
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: show VerifyEmail flow
  if (step === 'verify') {
    return <VerifyEmail />;
  }

  // Step 1: email input form
  return (
    <div className={Styles.forgotPasswordFormContainer}>
      <div className={Styles.forgotPasswordHeader}>
        <Image 
          src={Logo} 
          alt="jeearchive-logo" 
          width={60}
          height={60}
          className={Styles.logo}
        />
        <h2 className={Styles.forgotPasswordHeading}>Reset your password</h2>
        <p className={Styles.forgotPasswordSubtext}>
          Enter your email address and we will send you an OTP to reset your password.
        </p>
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.forgotPasswordForm}>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          placeholder="you@example.com"
        />

        <AuthButton type="submit" loading={loading}>
          <div className="font-medium">Verify Email</div>
        </AuthButton>

        <div className={Styles.backToLogin}>
          <Link href="/login" className={`${Styles.onboardingNavigation} font-medium`}>
            Back to <span className={Styles.loginNavigation}>login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
