import type { Metadata } from "next";
import { SignupForm } from '@/components/auth/Signup/SignupForm';
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Sign Up - Start Free JEE Preparation | JEE Archive",
  description:
    "Create your free JEE Archive account. Get access to 10,000+ JEE Main & Advanced mock tests, chapter-wise PYQs, and detailed solutions with NTA interface.",
  alternates: {
    canonical: "https://jeearchive.com/signup",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <SignupForm />
    </Suspense>
  );
}