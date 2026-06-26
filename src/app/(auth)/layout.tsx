// app/(auth)/layout.tsx

import './layout.css';
import dynamic from 'next/dynamic';
import AuthFormContainer from './AuthFormContainer';

// Lazy load the carousel to improve LCP & INP
const OnboardingCarousel = dynamic(
  () => import('@/components/layout/LoginCarausel').then((mod) => mod.OnboardingCarousel)
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="onboarding">
      <div className="carousel-wrapper">
        <OnboardingCarousel />
      </div>

      <AuthFormContainer>
        {children}
      </AuthFormContainer>
    </div>
  );
}