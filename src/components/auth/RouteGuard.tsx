"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.some((p) => path === p || path.startsWith(p + "/"));

// 1. Inner component handling the logic
const RouteGuardInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);
  
  const { stageNumber, syncStageNumber, fetchProfile, profile } = useUserStore();
  
  // 🔥 FIX 1: Use a ref to ensure we only call the API once per mount, preventing infinite loops
  const hasFetchedStage = useRef(false);

  // 🔥 FIX 2: Derived state! No need for a separate useState that causes cascading renders.
  const authed = !!accessToken;
  const isStageChecking = authed && stageNumber === null;

  useEffect(() => {
    if (!initialized) return;

    const onPublic = isPublicRoute(pathname);
    const isOnboarding = pathname === "/onboarding";

    // CASE 1: Not Authenticated
    if (!authed) {
      if (!onPublic) {
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    // CASE 2: Authenticated, but we don't know their onboarding stage yet
    if (stageNumber === null) {
      if (!hasFetchedStage.current) {
        hasFetchedStage.current = true;
        syncStageNumber(); // Zustand handles the state update cleanly
      }
      return; // Pause navigation until we know their stage
    }

    // CASE 3: Authenticated and we know their stage
    const isFullyOnboarded = stageNumber >= 4; // Assuming 4 means complete

    if (!isFullyOnboarded) {
      // 🚨 Bouncer Logic: User hasn't finished onboarding
      if (!isOnboarding && !onPublic) {
        router.replace(`/onboarding?redirectTo=${encodeURIComponent(pathname)}`);
      } else if (onPublic) {
        router.replace("/onboarding");
      }
    } else {
      // ✅ User is fully onboarded
      if (onPublic || isOnboarding) {
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        router.replace(redirectTo);
      }
      
      // Quietly fetch their full profile in the background if we don't have it yet
      if (!profile && !onPublic && !isOnboarding) {
        fetchProfile();
      }
    }
  }, [
    initialized, 
    authed, 
    pathname, 
    router, 
    searchParams, 
    stageNumber, 
    syncStageNumber, 
    profile, 
    fetchProfile
  ]);

  // Screen remains fully black/loading while we verify the stage without causing render loops
  if (!initialized || isStageChecking) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--dashboard-background-color, #0B0E14)' }}>
      </div>
    );
  }

  return <>{children}</>;
};

// 2. Export wrapper with Suspense
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--dashboard-background-color, #0B0E14)' }} />
    }>
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
};

export default RouteGuard;