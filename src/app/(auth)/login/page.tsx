"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/Login/LoginForm";
import { Loader } from "@/components/ui/loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center min-h-[400px]"><Loader label="Loading..." size="h-6 w-6" /></div>}>
      <LoginForm />
    </Suspense>
  );
}