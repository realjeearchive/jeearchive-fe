// src/app/(exam)/previous-year-questions/jee-mains/[year]/tests/[testId]/attempt/page.tsx

import { AttemptClient } from "./AttemptClient";

interface AttemptPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { year, testId } = await props.params;

  // We no longer fetch server-side here because we need the client-side 
  // accessToken for the API and crypto-js for decryption.
  
  return (
    <AttemptClient
      year={year}
      testId={testId}
    />
  );
}