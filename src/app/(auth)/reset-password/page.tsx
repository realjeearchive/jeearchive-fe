import type { Metadata } from "next";
import { ResetPasswordForm } from '@/components/auth/ResetPassword/ResetPassword';
import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Reset Password - JEE Archive",
  description:
    "Set a new password for your JEE Archive account to continue your JEE preparation.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}