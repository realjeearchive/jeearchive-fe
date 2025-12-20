import { getTestAttemptData } from "@/features/tests/api";
import AttemptClient from "./AttemptClient";

interface AttemptPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function AttemptPage(props: AttemptPageProps) {
  const { year, testId } = await props.params;
  const data = await getTestAttemptData(testId);

  return <AttemptClient year={year} testId={testId} data={data} />;
}
