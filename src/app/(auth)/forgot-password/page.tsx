import { ForgotPasswordForm } from '@/components/auth/ForgotPassword/ForgotPasswordForm';
import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}