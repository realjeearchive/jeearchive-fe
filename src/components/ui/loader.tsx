import React from 'react';

interface LoaderProps {
  className?: string; // For colors like 'text-white' or 'text-black'
  size?: string;      // For sizing classes like 'h-5 w-5'
  label?: string;     // Optional text to show next to spinner
}

export function Loader({ 
  // 🔥 FIX 1: Default to your light text variable instead of text-current.
  // This makes it visible on dark backgrounds out-of-the-box. 
  // Buttons that pass "text-current" will still override this perfectly!
  className = "text-[var(--login-page-primary-text-color,#FAFAFC)]", 
  size = "h-5 w-5", 
  label 
}: LoaderProps) {
  return (
    // 🔥 FIX 2: Applied className to the OUTER div so BOTH the spinner and text inherit the color
    <div className={`flex items-center justify-center font-medium ${className}`}>
      <svg 
        className={`animate-spin ${size} ${label ? 'mr-3' : ''}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}