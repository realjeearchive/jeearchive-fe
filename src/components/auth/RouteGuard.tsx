"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { BrandSplashScreen } from "@/components/ui/BrandSplashScreen/BrandSplashScreen";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/privacy-policy",
  "/terms-of-service",
  "/about-us",
  "/contact-us",
];

const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.some((p) => path === p || path.startsWith(p + "/"));

const RouteGuardInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);
  
  const { stageNumber, syncStageNumber, fetchProfile, profile } = useUserStore();
  
  const hasFetchedStage = useRef(false);

  const authed = !!accessToken;
  const isStageChecking = authed && stageNumber === null;

  // Reset the fetch flag if auth state changes (e.g. user just logged in)
  const prevAuthed = useRef(authed);
  if (prevAuthed.current !== authed) {
    hasFetchedStage.current = false;
    prevAuthed.current = authed;
  }

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
        // Read from the URL here rather than useSearchParams(), which would
        // force public pages to render client-only behind the splash screen.
        const redirectTo = new URLSearchParams(window.location.search).get("redirectTo") || "/dashboard";
        console.info(`[Auth: RouteGuard] Fully onboarded user on public route. Redirecting to ${redirectTo}.`);
        router.replace(redirectTo);
      }
      
      if (!profile && !onPublic && !isOnboarding) {
        fetchProfile();
      }
    }
  }, [
    initialized, authed, pathname, router,
    stageNumber, syncStageNumber, profile, fetchProfile
  ]);

  // Public pages (login, signup, legal) render straight away, so their HTML
  // is prerendered and shows before the auth check returns. A signed-in user
  // who lands on one is redirected by the effect above once it resolves.
  if (!isPublicRoute(pathname) && (!initialized || isStageChecking)) {
    return <BrandSplashScreen />;
  }

  return <>{children}</>;
};

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<BrandSplashScreen />}>
      <RouteGuardInner>{children}</RouteGuardInner>
    </Suspense>
  );
};

export default RouteGuard;