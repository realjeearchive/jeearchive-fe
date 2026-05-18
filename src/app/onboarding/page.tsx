import OnboardingWizard from "@/components/auth/Onboarding/OnboardingWizard";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export default function OnboardingPage() {
  return (
    <main>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader label="Loading onboarding..." size="h-6 w-6" /></div>}>
        <OnboardingWizard />
      </Suspense>
    </main>
  );
}