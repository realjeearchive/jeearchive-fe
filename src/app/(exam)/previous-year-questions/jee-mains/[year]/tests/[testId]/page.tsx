import layoutStyles from "./testOverview.module.css";
import { getTestDetails } from "@/features/tests/api";
import Image from "next/image";

import { InstructionsHeader } from "@/components/testInstructions/InstructionsHeader/InstructionsHeader";
import { NavigationAndAnswering } from "@/components/testInstructions/NavigationAndAnswering/NavigationAndAnswering";
import { PaperStructure } from "@/components/testInstructions/PaperStructure/PaperStructure";
import { CandidatePanel } from "@/components/testInstructions/CandidatePanel/CandidatePanel";
import { BottomConsentBar } from "@/components/testInstructions/BottomConsentBar/BottomConsentBar";
import instructionsLegend from "@/assets/image/instructions.png";


interface TestOverviewPageProps {
  params: Promise<{ year: string; testId: string }>;
}

export default async function TestOverviewPage(props: TestOverviewPageProps) {
  const { year, testId } = await props.params;
  const details = await getTestDetails(testId);
  const { summary, sections } = details;

  const attemptHref = `/previous-year-questions/jee-mains/${year}/tests/${testId}/attempt`;

  return (
    <div className={layoutStyles.page}>
      {/* Top blue bar */}
      <header className={layoutStyles.topBar}>
        <div className={layoutStyles.topBarTitle}>Instructions</div>
      </header>

      {/* Middle area */}
      <div className={layoutStyles.main}>
        <section className={layoutStyles.instructionsPanel}>
          <InstructionsHeader />

          <div className={layoutStyles.legendImageBlock}>
            <Image
              src={instructionsLegend}
              alt="Question palette symbols and meaning"
              className={layoutStyles.legendImage}
              priority
            />
          </div>

          <ol className={layoutStyles.continuedList} start={4}>
            <li>
              The Marked for Review status for a question simply indicates that you
              would like to look at the question again.
            </li>
            <li>
              You can click on the &quot;&gt;&quot; arrow which appears to the left of
              question palette to collapse question palette thereby maximizing the
              question window. To view the question palette again you can click on the
              &quot;&lt;&quot; arrow which appears on the right side of question
              window.
            </li>
            <li>
              You can click on <span>↓</span> to navigate to the bottom and{" "}
              <span>↑</span> to navigate to the top area, without scrolling.
            </li>
            <li>
              At the end of this &quot;INSTRUCTIONS TO CANDIDATES&quot;, click on the
              checkbox beside the &quot;I HAVE READ ALL THE INSTRUCTIONS AND SHALL
              ABIDE BY THEM&quot; and then you will be able to proceed and answer the
              questions at the designated time of the start of the examination. Your
              on-screen clock will start at the designated time of the start of the
              examination.
            </li>
            <li>
              A Test Summary page will be displayed before final submission. It will
              help you in reconciling the result and in case of any discrepancy.
            </li>
          </ol>

          <NavigationAndAnswering />

          <PaperStructure sectionsCount={sections.length} />
        </section>

        <aside className={layoutStyles.candidatePanelWrapper}>
          <CandidatePanel candidateLabel={summary.title} />
        </aside>
      </div>

      {/* Fixed bottom bar */}
      <footer className={layoutStyles.bottomBar}>
        <BottomConsentBar
        note="All the questions will appear in English language."
        attemptHref={attemptHref}
        />
      </footer>
    </div>
  );
}
