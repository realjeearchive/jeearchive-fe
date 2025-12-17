'use client';

import { useState, useEffect } from 'react';
import './layout.css';
import { OnboardingCarousel } from '@/components/layout/LoginCarausel';
import { ChevronUp, ChevronDown } from 'lucide-react';

type FormState = 'collapsed' | 'expanded';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formState, setFormState] = useState<FormState>('collapsed');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 900);
      if (window.innerWidth >= 900) {
        setFormState('collapsed');
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const getButtonText = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('signup') || path.includes('register')) return 'Sign Up';
      if (path.includes('login') || path.includes('signin')) return 'Sign In';
      if (path.includes('forgot-password') || path.includes('reset')) return 'Reset Password';
    }
    return 'Continue';
  };

  const toggleForm = () => {
    setFormState(prev => prev === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (isMobileView && formState === 'expanded' && e.target === e.currentTarget) {
      setFormState('collapsed');
    }
  };

  return (
    <div className={`onboarding ${isMobileView ? 'mobile-view' : ''}`}>
      <div className="carousel-wrapper">
        <OnboardingCarousel />
      </div>

      {isMobileView && formState === 'expanded' && (
        <div 
          className="form-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <div 
        className={`form-section ${isMobileView ? 'mobile' : ''} ${formState}`}
        data-state={formState}
      >
        {isMobileView && (
          <button 
            className={`form-toggle-button ${formState}`}
            onClick={toggleForm}
            aria-expanded={formState === 'expanded'}
            aria-label={formState === 'collapsed' ? `Show ${getButtonText()} form` : 'Hide form'}
          >
            <span className="toggle-button-text">
              {formState === 'collapsed' ? getButtonText() : 'Hide'}
            </span>
            {formState === 'collapsed' ? (
              <ChevronUp className="toggle-icon" size={20} />
            ) : (
              <ChevronUp className="toggle-icon" size={20} />
            )}
          </button>
        )}

        <div className={`form-content ${isMobileView ? `mobile mobile-${formState}` : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}