'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';

type FormState = 'collapsed' | 'expanded';

export default function AuthFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formState, setFormState] = useState<FormState>('collapsed');
  const pathname = usePathname() || '';

  const getButtonText = () => {
    const path = pathname.toLowerCase();
    if (path.includes('signup') || path.includes('register')) return 'Sign Up';
    if (path.includes('login') || path.includes('signin')) return 'Sign In';
    if (path.includes('forgot-password') || path.includes('reset')) return 'Reset Password';
    return 'Continue';
  };

  const toggleForm = () => {
    setFormState(prev => prev === 'collapsed' ? 'expanded' : 'collapsed');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (formState === 'expanded' && e.target === e.currentTarget) {
      setFormState('collapsed');
    }
  };

  return (
    <>
      {formState === 'expanded' && (
        <div 
          className="form-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <div 
        className={`form-section ${formState}`}
        data-state={formState}
      >
        <button 
          className={`form-toggle-button ${formState}`}
          onClick={toggleForm}
          aria-expanded={formState === 'expanded'}
          aria-label={formState === 'collapsed' ? `Show ${getButtonText()} form` : 'Hide form'}
        >
          <span className="toggle-button-text">
            {formState === 'collapsed' ? getButtonText() : 'Hide'}
          </span>
          <ChevronUp className="toggle-icon" size={20} />
        </button>

        {/* Form and footer share one scroll area so the footer always sits
            below the form and can never overlap it on short screens. */}
        <div className="form-scroll">
          <div className={`form-content ${formState}`}>
            {children}
          </div>

          <div className="auth-footer-container">
            <div className="auth-footer-links">
              <Link href="/about-us">About Us</Link>
              <span className="dot-separator">•</span>
              <Link href="/contact-us">Contact Us</Link>
              <span className="dot-separator">•</span>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <span className="dot-separator">•</span>
              <Link href="/terms-of-service">Terms of Service</Link>
            </div>
            <p className="auth-footer-disclaimer">
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
