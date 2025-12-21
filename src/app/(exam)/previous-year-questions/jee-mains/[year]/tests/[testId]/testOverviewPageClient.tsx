"use client";

import { useState } from "react";
import layoutStyles from "./testOverview.module.css";
import { CandidatePanel } from "@/components/testInstructions/CandidatePanel/CandidatePanel";
import { InstructionsHeader } from "@/components/testInstructions/InstructionsHeader/InstructionsHeader";
import { NavigationAndAnswering } from "@/components/testInstructions/NavigationAndAnswering/NavigationAndAnswering";
import { PaperStructure } from "@/components/testInstructions/PaperStructure/PaperStructure";
import { BottomConsentBar } from "@/components/testInstructions/BottomConsentBar/BottomConsentBar";
import Image from "next/image";
import instructionsLegend from "@/assets/image/instructions.png";

interface Props {
  summaryTitle: string;
  sectionsCount: number;
  attemptHref: string;
}

export function TestOverviewPageClient({
  summaryTitle,
  sectionsCount,
  attemptHref,
}: Props) {
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  return (
    <div className={layoutStyles.page}>
      {/* Top blue bar */}
      <header className={layoutStyles.topBar}>
        <div className={layoutStyles.topBarTitle}>Instructions</div>

        {/* menu icon only visible on mobile via CSS */}
        <button
          type="button"
          className={layoutStyles.menuIcon}
          aria-label="Open candidate panel"
          onClick={() => setShowMobilePanel(true)}
        >
          <span className={layoutStyles.menuIconBar} />
          <span className={layoutStyles.menuIconBar} />
          <span className={layoutStyles.menuIconBar} />
        </button>
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
          <PaperStructure sectionsCount={sectionsCount} />
        </section>

        {/* Desktop candidate panel */}
        <aside className={layoutStyles.candidatePanelWrapper}>
          <CandidatePanel candidateLabel={summaryTitle} />
        </aside>

        {/* Mobile slide-in candidate panel */}
        <aside
          className={
            layoutStyles.mobileCandidatePanel +
            " " +
            (showMobilePanel ? layoutStyles.mobileCandidatePanelOpen : "")
          }
        >
          <div className={layoutStyles.mobilePanelHeader}>
            <span>Candidate details</span>
            <button
              type="button"
              className={layoutStyles.mobilePanelCloseButton}
              aria-label="Close candidate panel"
              onClick={() => setShowMobilePanel(false)}
            >
              ×
            </button>
          </div>
          <CandidatePanel candidateLabel={summaryTitle} />
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
