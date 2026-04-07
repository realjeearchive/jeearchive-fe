"use client";

import React, { useEffect } from "react";
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

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      // FIX: Respect the redirectTo parameter if it exists, otherwise default to dashboard
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.replace(redirectTo);
    }
  }, [initialized, accessToken, pathname, router, searchParams]);

  // always render children (no blocking splash)
  return <>{children}</>;
};

export default RouteGuard;