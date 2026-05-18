import { VerifyEmail } from '@/components/auth/VerifyEmail/VerifyEmail';
import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <VerifyEmail />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';