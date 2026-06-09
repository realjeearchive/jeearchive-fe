"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Loader } from "@/components/ui/loader"; // 🔥 Unified Loader imported

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.some((p) => path === p || path.startsWith(p + "/"));

const RouteGuardInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);
  
  const { stageNumber, syncStageNumber, fetchProfile, profile } = useUserStore();
  
  const hasFetchedStage = useRef(false);

  const authed = !!accessToken;
  const isStageChecking = authed && stageNumber === null;

  useEffect(() => {
    if (!initialized) return;

    const onPublic = isPublicRoute(pathname);
    const isOnboarding = pathname === "/onboarding";

    // CASE 1: Not Authenticated
    if (!authed) {
      if (!onPublic) {
        console.info(`[Auth: RouteGuard] Unauthenticated access to ${pathname}. Redirecting to login.`);
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    // CASE 2: Authenticated, but we don't know their onboarding stage yet
    if (stageNumber === null) {
      if (!hasFetchedStage.current) {
        console.info(`[Auth: RouteGuard] Checking onboarding stage...`);
        hasFetchedStage.current = true;
        syncStageNumber(); 
      }
      return; 
    }

    // CASE 3: Authenticated and we know their stage
    const isFullyOnboarded = stageNumber >= 4; 

    if (!isFullyOnboarded) {
      if (!isOnboarding && !onPublic) {
        console.info(`[Auth: RouteGuard] Incomplete onboarding (Stage ${stageNumber}). Redirecting to /onboarding.`);
        router.replace(`/onboarding?redirectTo=${encodeURIComponent(pathname)}`);
      } else if (onPublic) {
        router.replace("/onboarding");
      }
    } else {
      if (onPublic || isOnboarding) {
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        console.info(`[Auth: RouteGuard] Fully onboarded user on public route. Redirecting to ${redirectTo}.`);
        router.replace(redirectTo);
      }
      
      if (!profile && !onPublic && !isOnboarding) {
        fetchProfile();
      }
    }
  }, [
    initialized, authed, pathname, router, searchParams, 
    stageNumber, syncStageNumber, profile, fetchProfile
  ]);

  if (!initialized || isStageChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-main)]">
        {/* 🔥 Unified stealth loading state */}
        <Loader label="Authenticating..." size="h-6 w-6" />
      </div>
    );
  }

  return <>{children}</>;
};

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-main)]">
        <Loader label="Loading..." size="h-6 w-6" />
      </div>
    }>
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
};

export default RouteGuard;