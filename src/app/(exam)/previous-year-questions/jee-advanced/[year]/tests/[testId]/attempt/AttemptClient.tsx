"use client";

import { useEffect, useState } from "react";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { TestPlayerLayout } from "@/components/testPlayer/TestPlayerLayout/TestPlayerLayout";
import { fetchTestContent } from "@/features/tests/api";
import { Loader } from "@/components/ui/loader"; // 1. Import Loader

interface AttemptClientProps {
  year: string;
  testId: string;
}

export function AttemptClient({ year, testId }: AttemptClientProps) {
  const initFromDefinition = useTestEngineStore(s => s.initFromDefinition);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        const definition = await fetchTestContent(testId);
        
        if (definition) {
          initFromDefinition(definition);
        } else {
          setError("Failed to load test definition.");
        }
      } catch (err) {
        console.error(err);
        let msg = "Something went wrong loading the test.";
        
        if (err instanceof Error) {
          msg = err.message;
        } else if (typeof err === "string") {
          msg = err;
        }

        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      loadTest();
    }
  }, [testId, initFromDefinition]);

  // 2. Updated Loading State with Reusable Loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-white">
        <Loader label="Loading your test..." size="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return <TestPlayerLayout year={year} />;
}

export default AttemptClient;