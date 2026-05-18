// src/components/auth/FormError/FormError.tsx

import Styles from './FormError.module.css';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={Styles.errorContainer}>
      <div className={Styles.errorIcon}>
        <svg className={Styles.iconSvg} viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <circle cx="10" cy="10" r="9" strokeWidth="1.5" />
          <path d="M10 6v4M10 13h.01" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className={Styles.errorMessage}>{message}</p>
    </div>
  );
}
