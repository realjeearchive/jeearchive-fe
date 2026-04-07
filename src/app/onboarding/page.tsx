import OnboardingWizard from "@/components/auth/Onboarding/OnboardingWizard";
import { Suspense } from "react";

export default function OnboardingPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading onboarding...</div>}>
        <OnboardingWizard />
      </Suspense>
    </main>
  );
}