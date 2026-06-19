import React from 'react';
import Styles from './AuthButton.module.css';
import { Loader } from '@/components/ui/loader'; 

interface AuthButtonProps {
  type?: 'submit' | 'button';
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function AuthButton({
  type = 'submit',
  children,
  loading = false,
  onClick,
  disabled = false,
  fullWidth = true,
  variant = 'primary',
}: AuthButtonProps) {  

  const buttonClass = variant === 'secondary' ? Styles.onboardingButtonSecondary : Styles.onboardingButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${buttonClass} ${fullWidth ? 'w-full' : ''}`}
      aria-busy={loading}
    >
      {loading ? (
        <Loader 
          label="Loading..." 
          className="text-current -ml-1" 
          size="h-5 w-5" 
        />
      ) : (
        children
      )}
    </button>
  );
}