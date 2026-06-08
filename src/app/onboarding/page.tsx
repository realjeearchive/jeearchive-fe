import type { Metadata } from "next";
import OnboardingWizard from "@/components/auth/Onboarding/OnboardingWizard";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Complete Your Profile - JEE Archive",
  description:
    "Set up your JEE Archive profile to get personalized rank predictions, percentile estimates, and tailored practice recommendations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return (
    <main aria-label="Profile setup">
      <Suspense
        fallback={
          <div
            className="flex h-screen w-full items-center justify-center"
            role="status"
            aria-label="Loading onboarding"
          >
            <Loader label="Loading onboarding..." size="h-6 w-6" />
          </div>
        }
      >
        <OnboardingWizard />
      </Suspense>
    </main>
  );
}