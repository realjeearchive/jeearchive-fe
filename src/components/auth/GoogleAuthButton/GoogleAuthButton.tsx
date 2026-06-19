'use client';

import React, { useState } from 'react';
import Styles from './GoogleAuthButton.module.css';
import { GoogleLogin } from '@react-oauth/google';
import { googleLoginRequest } from '@/features/auth/api';
import { useAuthStore, useUserStore } from '@/store';
import { toast } from 'sonner';

export function GoogleAuthButton() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  return (
    <div className="w-full flex justify-center [&>div]:w-full [&>div]:flex [&>div]:justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              throw new Error("No credential received from Google");
            }
            const data = await googleLoginRequest({ idToken: credentialResponse.credential });
            
            if (!data || !data.accessToken) {
              throw new Error("Invalid response from server. Please try again.");
            }
            
            setAccessToken(data.accessToken);
            
            toast.success('Logged in successfully.');
            // RouteGuard will automatically handle fetching the stage and redirecting
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Google authentication failed';
            console.error(`[Auth: GoogleAuthButton] Login failed:`, err);
            toast.error(message);
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
