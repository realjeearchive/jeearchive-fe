import type { Metadata } from "next";
import { ForgotPasswordForm } from '@/components/auth/ForgotPassword/ForgotPasswordForm';
import { Suspense } from 'react';
import { Loader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Forgot Password - JEE Archive",
  description:
    "Reset your JEE Archive account password to continue practicing JEE Main & Advanced mock tests with NTA interface.",
  robots: {
    index: false, // Don't index utility pages
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}