// app/(auth)/layout.tsx
import type { Metadata } from 'next';
import './layout.css';
import { OnboardingCarousel } from '@/components/layout/LoginCarausel';

export const metadata: Metadata = {
  title: 'Authentication - Jeearchive',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="onboarding">
      {/* Carousel is full-screen background */}
      <div className="carousel-wrapper">
        <OnboardingCarousel />
      </div>

      {/* Right glass panel on top of carousel */}
      <div className="form-section">
        {children}
      </div>
    </div>
  );
}
