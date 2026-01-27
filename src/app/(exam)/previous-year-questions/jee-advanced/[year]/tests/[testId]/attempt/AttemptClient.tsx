"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { TestPlayerLayout } from "@/components/testPlayer/TestPlayerLayout/TestPlayerLayout";
import { fetchTestSession } from "@/features/tests/api";
import { Loader } from "@/components/ui/loader";
import { HierarchicalSessionData } from "@/features/tests/types";

interface AttemptClientProps {
  year: string;
  testId: string;
}

export function AttemptClient({ year, testId }: AttemptClientProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sid");

  const initFromBackendSession = useTestEngineStore(s => s.initFromBackendSession);
  const isInitialized = useTestEngineStore(s => s.isInitialized);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    async function loadSession() {
      if (!sessionId) {
        setError("Invalid Session ID. Please go back.");
        setLoading(false);
        return;
      }

      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        console.log("Fetching Advanced Session:", sessionId);
        const response = await fetchTestSession(sessionId);
        
        // Robust Data Handling for Wrapped vs Unwrapped responses
        let sessionData: HierarchicalSessionData | null = null;

        if (response.data && response.data.session) {
          sessionData = response.data;
        } 
        // @ts-expect-error - Checking for property existence on unknown type
        else if (response.session) {
          sessionData = response as unknown as HierarchicalSessionData;
        }

        if (sessionData) {
          initFromBackendSession(sessionData);
        } else {
          console.error("Invalid Response Structure:", response);
          setError("Failed to load test session data.");
        }

      } catch (err) {
        console.error("Session Load Error:", err);
        setError("Network error. Could not load the test.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId, initFromBackendSession]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-white">
        <Loader label="Initializing Test Environment..." size="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-900 text-red-500">
        <p className="text-lg font-semibold">Error: {error}</p>
        <a 
          href={`/previous-year-questions/jee-advanced/${year}/tests/${testId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Instructions
        </a>
      </div>
    );
  }

  if (!isInitialized) return null;

  return <TestPlayerLayout year={year} />;
}

export default AttemptClient;