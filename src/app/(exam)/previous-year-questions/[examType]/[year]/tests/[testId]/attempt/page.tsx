import { AttemptClient } from "./AttemptClient";

interface AttemptPageProps {
  // 🔥 Added examType to the params
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { examType, year, testId } = await props.params;
  
  return (
    <AttemptClient
      examType={examType}
      year={year}
      testId={testId}
    />
  );
}