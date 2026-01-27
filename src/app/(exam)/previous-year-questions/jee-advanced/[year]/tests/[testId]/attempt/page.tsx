import { AttemptClient } from "./AttemptClient";

interface AttemptPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { year, testId } = await props.params;
  
  return (
    <AttemptClient
      year={year}
      testId={testId}
    />
  );
}