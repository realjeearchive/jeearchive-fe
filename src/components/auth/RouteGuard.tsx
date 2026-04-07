"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.some((p) => path === p || path.startsWith(p + "/"));

// 1. Rename your original component to "RouteGuardInner"
const RouteGuardInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) return;

    const authed = !!accessToken;
    const onPublic = isPublicRoute(pathname);

    if (!authed && !onPublic) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }

    if (authed && onPublic) {
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.replace(redirectTo);
    }
  }, [initialized, accessToken, pathname, router, searchParams]);

  // always render children (no blocking splash)
  return <>{children}</>;
};

// 2. Export a wrapper that puts the inner logic inside a Suspense boundary
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<>{children}</>}>
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
};

export default RouteGuard;