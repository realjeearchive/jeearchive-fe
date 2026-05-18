import { ResetPasswordForm } from '@/components/auth/ResetPassword/ResetPassword';
import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';