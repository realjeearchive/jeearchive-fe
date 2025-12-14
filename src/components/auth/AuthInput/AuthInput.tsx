'use client';

import { useState } from 'react';
import Styles from './AuthInput.module.css';

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export function AuthInput({
  id,
  name,
  type,
  label,
  required = false,
  placeholder,
  error,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  const inputType = isPasswordField && showPassword ? 'text' : type;
  const resolvedPlaceholder =
    placeholder || (isPasswordField ? label : undefined);

  return (
    <div className={Styles.inputWrapper}>
      <div className={Styles.inputInner}>
        <input
          id={id}
          name={name}
          type={inputType}
          required={required}
          placeholder={resolvedPlaceholder}
          className={`${Styles.onboardingInput} ${
            error ? Styles.inputError : Styles.inputNormal
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            className={Styles.togglePassword}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className={Styles.errorText}>{error}</p>}
    </div>
  );
}
