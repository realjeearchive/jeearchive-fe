import { getTestDetails } from "@/features/tests/api";
import { TestOverviewPageClient } from "./testOverviewPageClient";

interface TestOverviewPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function TestOverviewPage(props: TestOverviewPageProps) {
  const { year, testId } = await props.params;
  const details = await getTestDetails(testId);
  const { summary, sections } = details;

  const attemptHref = `/previous-year-questions/jee-mains/${year}/tests/${testId}/attempt`;

  return (
    <TestOverviewPageClient
      summaryTitle={summary.title}
      sectionsCount={sections.length}
      attemptHref={attemptHref}
    />
  );
}
