'use client';

import React, { useState } from 'react';
import Styles from './GoogleAuthButton.module.css';
import { GoogleLogin } from '@react-oauth/google';
import { googleLoginRequest } from '@/features/auth/api';
import { useAuthStore, useUserStore } from '@/store';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface GoogleAuthButtonProps {
  label?: string;
  redirectTo?: string;
}

export function GoogleAuthButton({ label = 'Continue with Google', redirectTo }: GoogleAuthButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const syncStageNumber = useUserStore((s) => s.syncStageNumber);

  return (
    <div className="w-full flex justify-center [&>div]:w-full [&>div]:flex [&>div]:justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              throw new Error("No credential received from Google");
            }
            setLoading(true);
            const data = await googleLoginRequest({ idToken: credentialResponse.credential });
            
            setAccessToken(data.accessToken);
            
            const stage = await syncStageNumber();
            
            toast.success('Logged in successfully.');
            
            let path = redirectTo || searchParams.get('redirectTo');
            if (!path) {
              if (stage !== null && stage < 5) {
                path = '/onboarding';
              } else {
                path = '/dashboard';
              }
            }
            router.replace(path);
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Google authentication failed';
            console.error(`[Auth: GoogleAuthButton] Login failed:`, err);
            toast.error(message);
          } finally {
            setLoading(false);
          }
        }}
        onError={() => {
          console.error('Google login error');
          toast.error('Google authentication failed. Please try again.');
        }}
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
        logo_alignment="center"
        width="320"
      />
    </div>
  );
}
