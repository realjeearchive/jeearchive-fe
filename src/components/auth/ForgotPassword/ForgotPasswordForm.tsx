'use client';

import Styles from './ForgotPasswordForm.module.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.png';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <h2 className={Styles.forgotPasswordHeading}>Check your email</h2>
        </div>

        <div className={Styles.successMessage}>
          <div className={Styles.successIcon}>
            <svg className={Styles.iconSvg} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={Styles.successContent}>
            <p className={Styles.successText}>
              We have sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </p>
          </div>
        </div>

        <div className={Styles.backToLogin}>
          <Link href="/login" className={`${Styles.onboardingNavigation} font-medium`}>
            Back to <span className={Styles.loginNavigation}>login</span>
          </Link>
        </div>
      </div>
    );
  }

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
          Enter your email address and we will send you a link to reset your password.
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
          <div className='font-medium'>Send reset link</div>
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
