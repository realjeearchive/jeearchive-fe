import { VerifyEmail } from '@/components/auth/VerifyEmail/VerifyEmail';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
  return <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmail />
      </Suspense>;
}

export const dynamic = 'force-dynamic';

