"use client";

import { useEffect } from "react";
import type { TestDefinition } from "@/features/tests/types";
import { useTestEngineStore } from "@/features/tests/testEngineStore";
import { TestPlayerLayout } from "@/components/testPlayer/TestPlayerLayout/TestPlayerLayout";

interface AttemptClientProps {
  year: string;
  testId: string;
  definition: TestDefinition;
}

export function AttemptClient({ year, definition }: AttemptClientProps) {
  const initFromDefinition = useTestEngineStore(s => s.initFromDefinition);

  useEffect(() => {
    initFromDefinition(definition);
  }, [definition, initFromDefinition]);

  return <TestPlayerLayout year={year} />;
}

export default AttemptClient;
