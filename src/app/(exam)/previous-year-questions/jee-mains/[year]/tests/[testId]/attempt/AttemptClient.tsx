"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { TestPlayerLayout } from "@/components/testPlayer/TestPlayerLayout/TestPlayerLayout";
import { fetchTestSession } from "@/features/tests/api";
import { Loader } from "@/components/ui/loader";

interface AttemptClientProps {
  year: string;
  testId: string; // Note: In the URL path, this is the Paper ID
}

export function AttemptClient({ year, testId }: AttemptClientProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sid"); // This is the actual Session ID

  const initFromBackendSession = useTestEngineStore(s => s.initFromBackendSession);
  const isInitialized = useTestEngineStore(s => s.isInitialized);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to ensure we don't fetch twice in React Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    async function loadSession() {
      // 1. Validation
      if (!sessionId) {
        setError("Invalid Session ID. Please go back and restart the test.");
        setLoading(false);
        return;
      }

      // 2. Prevent Duplicate Fetch
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        console.log("Fetching Session:", sessionId);
        const response = await fetchTestSession(sessionId);

        if (response.success && response.data) {
          // 3. Hydrate the Store
          initFromBackendSession(response.data);
        } else {
          setError("Failed to retrieve test session data.");
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

  // --- RENDER STATES ---

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
          href={`/previous-year-questions/jee-mains/${year}/tests/${testId}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Instructions
        </a>
      </div>
    );
  }

  // Only render layout if initialized to prevent flashes
  if (!isInitialized) {
    return null; 
  }

  return <TestPlayerLayout year={year} />;
}

export default AttemptClient;