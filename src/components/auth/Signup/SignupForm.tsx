'use client';

import Styles from './SignupForm.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClientSearchParam } from '@/lib/useClientSearchParam';
import Link from 'next/link';
import Image from 'next/image';
import { AuthInput } from '../AuthInput/AuthInput';
import { AuthButton } from '../AuthButton/AuthButton';
import { FormError } from '../FormError/FormError';
import Logo from '../../../../public/images/logo.webp';
import type { SignupInput } from '@/features/auth/schemas';

// zod (~56 KB) is only needed on submit, so it's kept off the initial page
// load and fetched when the email form opens (or on submit at the latest).
const loadValidation = () =>
  Promise.all([import('zod'), import('@/features/auth/schemas')]);
import { GoogleAuthButton } from '../GoogleAuthButton/GoogleAuthButton';
import { signupRequest, type SignupResponse } from '@/features/auth/api';
import { toast } from 'sonner';
import { MdEmail, MdClose } from 'react-icons/md';

export function SignupForm() {
  const router = useRouter();
  const methodParam = useClientSearchParam('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // null until the user picks; until then ?method=email decides.
  const [emailChoice, setShowEmailForm] = useState<boolean | null>(null);
  const showEmailForm = emailChoice ?? methodParam === 'email';

  useEffect(() => {
    if (showEmailForm) void loadValidation();
  }, [showEmailForm]);

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

    const [{ z }, { signupSchema }] = await loadValidation();
    let parsed: SignupInput;

    try {
      parsed = signupSchema.parse(rawData);
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
      console.info(`[Auth: SignupForm] Attempting account creation for: ${parsed.email}`);
      const data: SignupResponse = await signupRequest(parsed);
      
      console.info(`[Auth: SignupForm] Account created successfully, awaiting OTP for: ${parsed.email}`);
      toast.success(data.message || 'OTP sent to your email.');

      router.push(`/verify-email?email=${encodeURIComponent(parsed.email)}&redirectTo=/onboarding`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      console.error(`[Auth: SignupForm] Signup failed:`, err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${Styles.signupFormContainer} relative`}>
      <div className={Styles.signupHeader}>
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
        <h2 className={`${Styles.signupHeading} text-[36px]`}>{"Let's get started"}</h2>
        {!showEmailForm && (
          <p className="text-center text-[var(--auth-text-secondary,theme(colors.gray.400))] text-[15px] leading-[1.5] max-w-[290px]">
            Master your prep - practice chapter-wise PYQs and take mock tests with the real NTA interface.
          </p>
        )}
      </div>

      <FormError message={error} />

      <form onSubmit={handleSubmit} className={Styles.signupForm}>
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
            <AuthInput id="name" name="name" type="text" label="Full Name" required placeholder="Full Name" error={fieldErrors.name} />
            <AuthInput id="email" name="email" type="email" label="Email address" required placeholder="Email" error={fieldErrors.email} />
            <AuthInput id="password" name="password" type="password" label="Password" required placeholder="Password" error={fieldErrors.password} />
            <AuthInput id="confirm-password" name="confirm-password" type="password" label="Confirm Password" required placeholder="Confirm Password" error={fieldErrors.confirmPassword} />

            <AuthButton type="submit" loading={loading}>
              <div className="font-medium">Create account</div>
            </AuthButton>

            <p className={Styles.onboardingNavigationText}>
              Already have an account?{' '}
              <Link href="/login?method=email" className={`${Styles.onboardingNavigation} font-medium`}>Sign in</Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
}