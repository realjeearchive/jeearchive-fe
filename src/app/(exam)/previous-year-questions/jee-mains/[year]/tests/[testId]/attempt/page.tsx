// app/(exam)/previous-year-questions/jee-mains/[year]/tests/[testId]/attempt/page.tsx

import { getTestAttemptData, buildTestDefinition } from "@/features/tests/api";
import { AttemptClient } from "./AttemptClient";

interface AttemptPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { year, testId } = await props.params;
  const attempt = await getTestAttemptData(testId);

  // later: candidateName from auth/user store
  const definition = buildTestDefinition(attempt, "Candidate Name");

  return (
    <AttemptClient
      year={year}
      testId={testId}
      definition={definition}
    />
  );
}
