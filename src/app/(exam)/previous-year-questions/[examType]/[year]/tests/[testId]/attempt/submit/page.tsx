import { TestSubmissionSummary } from "@/components/testPlayer/TestSubmissionSummary/TestSubmissionSummary";

interface SubmitPageProps {
  // We capture the params here, though your TestSubmissionSummary 
  // might be using internal state, keeping the dynamic route is best practice.
  params: Promise<{ examType: string; year: string; testId: string }>;
}

export default async function SubmitPage(props: SubmitPageProps) {
  // We await params just in case you need to use these 
  // to fetch specific final metadata for the summary page
  await props.params;

  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <TestSubmissionSummary />
    </main>
  );
}