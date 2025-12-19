"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);
  const initFromRefresh = useAuthStore((s) => s.initFromRefresh);

  useEffect(() => {
    initFromRefresh();
  }, [initFromRefresh]);

  useEffect(() => {
    if (!initialized) return;

    const authed = !!accessToken;
    const onPublic = isPublicRoute(pathname);

    if (!authed && !onPublic) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }

    if (authed && onPublic) {
      router.replace("/dashboard");
    }
  }, [initialized, accessToken, pathname, router]);

  // always render children (no blocking splash)
  return <>{children}</>;
};

export default RouteGuard;
