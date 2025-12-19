"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/Login/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
