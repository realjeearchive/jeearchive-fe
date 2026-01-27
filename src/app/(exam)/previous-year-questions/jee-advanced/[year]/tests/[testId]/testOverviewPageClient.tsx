"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import Image from "next/image";
import { toast } from "sonner";
import { CandidatePanel } from "@/components/testInstructions/CandidatePanel/CandidatePanel";
import { InstructionsHeader } from "@/components/testInstructions/InstructionsHeader/InstructionsHeader";
import { NavigationAndAnswering } from "@/components/testInstructions/NavigationAndAnswering/NavigationAndAnswering";
import { PaperStructure } from "@/components/testInstructions/PaperStructure/PaperStructure";
import { BottomConsentBar } from "@/components/testInstructions/BottomConsentBar/BottomConsentBar";
// Ensure this path matches your file structure exactly
import layoutStyles from "./testOverview.module.css"; 
import instructionsLegend from "@/assets/image/instructions.png";

interface Props {
  summaryTitle: string;
  sectionsCount: number;
  paperId: string;
  year: string;
}

export function TestOverviewPageClient({
  summaryTitle,
  sectionsCount,
  paperId,
  year,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sid");

  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const handleBegin = () => {
    // 1. Validation: Ensure we have a session ID
    if (!sessionId) {
      toast.error("Session ID missing. Please return to the dashboard and restart.");
      return;
    }
    
    // 2. Navigation: Go to Attempt Page with SID
    router.push(`/previous-year-questions/jee-mains/${year}/tests/${paperId}/attempt?sid=${sessionId}`);
  };

  return (
    <div className={layoutStyles.page}>
      <header className={layoutStyles.topBar}>
        <div className={layoutStyles.topBarTitle}>Instructions</div>
        <button 
          className={layoutStyles.menuIcon} 
          onClick={() => setShowMobilePanel(true)}
          aria-label="Open candidate panel"
        >
          <span className={layoutStyles.menuIconBar} />
          <span className={layoutStyles.menuIconBar} />
          <span className={layoutStyles.menuIconBar} />
        </button>
      </header>

      <div className={layoutStyles.main}>
        <section className={layoutStyles.instructionsPanel}>
          <InstructionsHeader />
          <div className={layoutStyles.legendImageBlock}>
            <Image src={instructionsLegend} alt="Legend" className={layoutStyles.legendImage} priority />
          </div>
          <ol className={layoutStyles.continuedList} start={4}>
            <li>The Marked for Review status for a question simply indicates that you would like to look at the question again.</li>
            <li>You can click on the &quot;&gt;&quot; arrow which appears to the left of question palette to collapse question palette thereby maximizing the question window.</li>
            <li>Click on the checkbox below to proceed...</li>
          </ol>
          <NavigationAndAnswering />
          <PaperStructure sectionsCount={sectionsCount} />
        </section>

        <aside className={layoutStyles.candidatePanelWrapper}>
          <CandidatePanel candidateLabel={summaryTitle} />
        </aside>

        <aside className={`${layoutStyles.mobileCandidatePanel} ${showMobilePanel ? layoutStyles.mobileCandidatePanelOpen : ""}`}>
           <div className={layoutStyles.mobilePanelHeader}>
            <span>Candidate details</span>
            <button className={layoutStyles.mobilePanelCloseButton} onClick={() => setShowMobilePanel(false)}>×</button>
          </div>
          <CandidatePanel candidateLabel={summaryTitle} />
        </aside>
      </div>

      <footer className={layoutStyles.bottomBar}>
        <BottomConsentBar
          note="All the questions will appear in English language."
          onConsent={handleBegin}
          customLabel="I am ready to begin"
        />
      </footer>
    </div>
  );
}