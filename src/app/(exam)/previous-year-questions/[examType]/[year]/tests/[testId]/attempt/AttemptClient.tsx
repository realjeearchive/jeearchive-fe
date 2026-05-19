"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { fetchTestSession } from "@/features/tests/api";
import { TestPlayerLayout } from "@/components/testPlayer/TestPlayerLayout/TestPlayerLayout";
import { Loader } from "@/components/ui/loader";
import type {
  HierarchicalSessionData,
  SessionDataResponse,
} from "@/features/tests/types";

interface AttemptClientProps {
  year: string;
  testId: string;
  examType: string; // Added to enable dynamic routing
}

/**
 * Type guard to check wrapped API response
 */
function isWrappedSessionResponse(
  response: unknown
): response is { data: HierarchicalSessionData } {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    typeof (response as { data: unknown }).data === "object" &&
    (response as { data: unknown }).data !== null &&
    "session" in (response as { data: HierarchicalSessionData }).data
  );
}

/**
 * Type guard to check direct session payload
 */
function isDirectSessionResponse(
  response: unknown
): response is HierarchicalSessionData {
  return (
    typeof response === "object" &&
    response !== null &&
    "session" in (response as HierarchicalSessionData)
  );
}

export function AttemptClient({ year, testId, examType }: AttemptClientProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sid");

  const initAuth = useAuthStore((s) => s.initFromRefresh);
  const authInitialized = useAuthStore((s) => s.initialized);

  const initFromBackendSession = useTestEngineStore(
    (s) => s.initFromBackendSession
  );
  const isInitialized = useTestEngineStore((s) => s.isInitialized);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
  async function loadSession() {
    if (!sessionId) {
      setError("Session not found. Go back and start the test again.");
      setLoading(false);
      return;
    }

    if (!authInitialized) {
      await initAuth();
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      console.info(`[AttemptClient] Fetching session: ${sessionId} for ${examType}`);
      const response: SessionDataResponse | HierarchicalSessionData = await fetchTestSession(sessionId);

      let sessionData: HierarchicalSessionData | null = null;
      if (isWrappedSessionResponse(response)) sessionData = response.data;
      else if (isDirectSessionResponse(response)) sessionData = response;

      if (!sessionData) throw new Error("Invalid session payload");

      initFromBackendSession(sessionData);
    } catch (err) {
      console.error("[AttemptClient] Session load failed:", err);
      setError("Couldn't load questions. Check your connection and refresh.");
    } finally {
      setLoading(false);
    }
  }

  loadSession();
}, [sessionId, authInitialized, initAuth, initFromBackendSession, examType]);

  // ---------------- UI STATES ----------------

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
        <Loader label="Initializing Test Environment..." size="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-900 text-red-500">
        <p className="text-lg font-semibold">{error}</p>
        <a 
          // 🔥 DYNAMIC LINK: Uses the examType prop correctly
          href={`/previous-year-questions/${examType}/${year}/tests/${testId}`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Return to Instructions
        </a>
      </div>
    );
  }

  if (!isInitialized) return null;

  return <TestPlayerLayout />;
}